window.fetchAndRenderProductList = (
  payload,
  { wrapperElement, mountElement }
) => {
  fetch(
    `${window.DukaanData.CLIENT_API_ENDPOINT}/api/advanced-search/${window.DukaanData.DUKAAN_STORE.id}/`,
    {
      method: 'post',
      body: JSON.stringify({
        ...payload,
        continue_selling_when_oos: true,
        show_out_of_stock_products: true,
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-requested-with': window?.DukaanData?.DUKAAN_SESSION_ID,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )
    .then((res) => res.json())
    .then((res) => {
      if (res) {
        const { products = [] } = res?.data || {};

        if (!products?.length) {
          return;
        }
        wrapperElement.classList.remove('hidden');
        DukaanData.PRODUCTS_MAP = {
          ...DukaanData.PRODUCTS_MAP,
          ...products.reduce((map, product) => {
            if (DukaanData?.PRODUCTS_MAP?.[product.uuid]?.skusApi) return map;
            const serializedSKUs = serializeSKUs(product.skus || []);
            const attributes = getAllProductAttributeValues(serializedSKUs);
            map[product.uuid] = {
              ...product,
              skus: serializedSKUs,
              attributes,
            };
            return map;
          }, {}),
        };
        productListRenderer(mountElement, products.slice(0, 5), {
          templateId: 'dkn-product-card-template',
        });
      }
    })
    .catch(() => {});
};

window.appInitializer = () => {
  const payload = {
    category_ids: [1234],
    offset: 0,
    page_size: 30,
  };

  // const payloadWithProductIds = {
  //   product_ids: [11958348, 11958349, 11958340]
  //   offset: 0,
  //   page_size: 30,
  // };

  window.fetchAndRenderProductList(payload, {
    wrapperElement: q$.select('.custom-product-list-wrapper').elem,
    mountElement: q$.select('.custom-product-list').elem,
  });
};
