export const elements = {
    coreContainer: document.querySelector('.core_container'),
    coreProduct: document.querySelector('.coreProduct'),
    coreProductMenu: document.querySelector('.coreProductMenu'),
    manageProductMenu: document.querySelector('.manageProduct'),
    cekHargaMenu: document.querySelector('.menuHarga'),
    warehouseMenu: document.querySelector('.manageWarehouse'),
    competitorProductMenu: document.querySelector('.menuCompetitor'),
    addProduct: document.querySelector('.addProduct'),
    productContainer: document.querySelector('.core_product_container'),
    productUpdate: document.querySelector('core_product_update_product'),
    productUpdateForm: document.querySelector('formUpdateProduct'),
    searchForm: document.querySelector('#prodSearch'),
    pricingProductSelection: document.querySelector('.pricingProductSelection'),
    pricingContainer: document.querySelector('.pricingContainer'),
    productDisplay: document.querySelector('.core_product_tadble')
};
export const renderLoader = (parent)=>{
    const loader = `
        <div class="loader">
            <i class="fa fa-circle-o-notch fa-spin" style="font-size:48px;color:blue"></i>
            <h3>Tunggu Sebentar...</h3>
        </div>
    `;
    parent.insertAdjacentHTML("beforeend",loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.loader`);
    if (loader){
        loader.parentElement.removeChild(loader);
    };
};
export const currencyFormat = (amount) =>{
    //console.log(amount);
    amount = (Math.floor(amount)).toString();
    return `Rp ${amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ,-`;
}