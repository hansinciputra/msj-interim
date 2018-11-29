import {elements, currencyFormat} from "./base";

const renderProductHtml = (cur) =>{
    if(cur.type === "WPA"){
        var newType = `${cur.type} 0${cur.size} ratio 1 : ${cur.ratio}`;
    }else if(cur.type === "WPA SPAREPART"){
        var newType = `${cur.type} ${cur.partType} 0${cur.size} ratio 1 : ${cur.ratio}`;
    }
    else if(cur.type === "NMRV"){
        var newType = `${cur.type} 0${cur.size} ${cur.flange} ratio 1 : ${cur.ratio}`;
    }
    else if(cur.type === "NMRV SPAREPART"){
        var newType = `${cur.type} ${cur.partType} 0${cur.size} ${cur.flange} ratio 1 : ${cur.ratio}`;
    }
    else if(cur.type === "DINAMO"){
        var newType = `${cur.type} ${cur.phase}Phasa / ${cur.model} / ${cur.hp} HP(${cur.hp*0.75}KW) / ${cur.rpm}rpm / ${cur.material}`;
    }else if(cur.type === "OTHERS"){
        var newType = `${cur.spec}`;
    }
    //console.log(cur);
    //console.log(cur.code);
        return `<li class = "productRow">
              <span class = "product_code">${cur.code}</span>
              <span class = "product_type">${newType}</span>
              <span class = "product_stock">${cur.quantity} Unit</span>
              <span class = "product_price">${currencyFormat(cur.price)}</span>  
              <span class = "product_edit">
                <i class="fa fa-edit editProduct" id = "${cur.docId}" style="font-size:24px;color:green;"></i>
                <i class="fa fa-trash-o deleteProduct" id = "${cur.docId}" style="font-size:24px;color:red;float:right;"></i>
              </span>  
        </li>`;
};

//create this function because i dont want to change renderProductHtml code.
export const renderNewAddedProduct = (product) => {
    const html = renderProductHtml(product);
    return html;
}
export const renderProduct = (product) =>{
//1. prepare the form/container (unhide from the page)
//productTitle();
//2. render a loader
//3. display the result in html
//console.log(product);
const temp = `
    <div class = "coreProduct">
    <h2>Core Product</h2>
    <div class ="core_product_container column1">
        
      <ul class = core_product_table>
      
                  <div class="wrap">
                      <div class="core_product_search">
                         <input type="text" id="prodSearch" class="searchTerm" placeholder="Tulis code atau nama barang">
                      </div>
                   </div>
        <div><a href="#" class ="coreProduct subMenu addProduct">Tambah Produk Baru</a>
        <a href="#" class ="coreProduct subMenu downloadCSV"> Export HTML Table To CSV File</a></div>
        <li>
            <span class = "product_code_title title">Code</span>
            <span class = "product_type_title title">Tipe</span>
            <span class = "product_stock title">Sisa Stock</span>
            <span class = "product_price title">Harga</span>
            <span class = "product_edit title"> ____ </span>
        </li>
        <div class = "table_overflow">
${product.map((cur) => renderProductHtml(cur)).join(' ')}`; 
elements.coreContainer.insertAdjacentHTML("beforeend",temp);

};

//delete the updateproductcontainer
export const resetUpdateContainerForm = () =>{
    document.querySelector('.core_product_update_product').parentNode.removeChild(document.querySelector('.core_product_update_product'));
}

const updateContainerOption = (type,intent,obj=``)=> {
    var data = obj.data;
    var docId = obj.code;

    const optionValue = `
            <select class = "prodSelect">
                <option value="options">Pilih Produk</option>
                <option value="WPA">WPA</option>
                <option value="NMRV">NMRV</option>
                <option value="DINAMO">DINAMO</option>
                <option value="WPAPART">WPA SPAREPART</option>
                <option value="NMRV SPAREPART">NMRV SPAREPART</option>
                <option value="OTHERS">OTHERS</option>
            </select>`;
    let html = ``;
    //setting updatecontainer berdasarkan pilihan dropdown type
    if(type==='options'){
        console.log("do nothing");
    }else if(type==='WPA'){
        //console.log(data);
        console.log("producView WPA updateContainerOption called");
        html = `
        <div class= "core_product_update_product column2">
          <i class="fa fa-window-close delUpdateForm" style="color:red; cursor:pointer"></i>  
          <h2>Tambah Product</h2>
          <form id = "formUpdateProduct">
            ${intent === 'add'? optionValue : ``}
            <br>
            <label>Code Barang</label>
            <input type="text" name="code" id = "prodCode" value= "${data === undefined ? `` : data.code}"><br />
            <label>Tipe</label>
            <input type="text" name="type" id = "prodType" value="WPA" style="border:0" readonly><br />
            <label>Size</label>
            <input type="number" name="size" id = "prodSize" placeholder="contoh : 40" value= "${data === undefined ? `` : data.size}" required="required" pattern="[A-Za-z0-9]{1,20}"><br />
            <label>Ratio</label>
            <input type="number" name="ratio" id = "prodRatio" placeholder="contoh : 10" value= "${data === undefined ? `` : data.ratio}" required="required" pattern="[A-Za-z0-9]{1,20}"><br />
            <label>Quantity</label>
            <input type="number" name="quantity" id = "prodQty" value= "${data === undefined ? `` : data.quantity}" required="required" pattern="[A-Za-z0-9]{1,20}"><br />
            <label>Harga Pricelist</label>
            <input type="number" name="price" id = "prodPrice" value= "${data === undefined ? `` : data.price}" required="required" pattern="[A-Za-z0-9]{1,20}"><br />
            <input type="hidden" name="intent" id = "prodIntent" value=  ${intent === 'add'? `add`: `update`}><br />
            <input type="hidden" name="intent" id = "docId"  ${docId === undefined ? ``: `value= ${docId}`}>
            <button class = "btnNewProd"> Submit </button>
        </form>
      </div>
        `;
    }else if(type==='WPAPART'){
        //console.log(data);
        console.log("producView WPA parts ContainerOption called");
        html = `
        <div class= "core_product_update_product column2">
          <i class="fa fa-window-close delUpdateForm" style="color:red; cursor:pointer"></i>  
          <h2>Tambah Product</h2>
          <form id = "formUpdateProduct">
            ${intent === 'add'? optionValue : ``}
            <br>
            <label>Code Barang</label>
            <input type="text" name="code" id = "prodCode" value= "${data === undefined ? `` : data.code}"><br />
            <label>Tipe</label>
            <input type="text" name="type" id = "prodType" value="WPA SPAREPART" style="border:0" readonly><br />
            <label>Tipe Part</label>
            <br>
            <select id = partType>
                        <option value="worm" ${data === undefined ? ``: (data.model === `worm` ? `selected = "selected"` : ``)}>Worm</option>
                        <option value="input_shaft" ${data === undefined ? ``: (data.model === `input_shaft` ? `selected = "selected"` : ``)}>Input Shaft</option>
                        <option value="output_shaft" ${data === undefined ? ``: (data.model === `output_shaft` ? `selected = "selected"` : ``)}>Output Shaft</option>
            </select>
            <br>
            <label>Size</label>
            <input type="number" name="size" id = "prodSize" placeholder="contoh : 40" value= "${data === undefined ? `` : data.size}" required="required" pattern="[A-Za-z0-9]{1,20}"><br />
            <label>Ratio</label>
            <input type="number" name="ratio" id = "prodRatio" placeholder="contoh : 10" value= "${data === undefined ? `` : data.ratio}" required="required" pattern="[A-Za-z0-9]{1,20}"><br />
            <label>Quantity</label>
            <input type="number" name="quantity" id = "prodQty" value= "${data === undefined ? `` : data.quantity}" required="required" pattern="[A-Za-z0-9]{1,20}"><br />
            <label>Harga Pricelist</label>
            <input type="number" name="price" id = "prodPrice" value= "${data === undefined ? `` : data.price}" required="required" pattern="[A-Za-z0-9]{1,20}"><br />
            <input type="hidden" name="intent" id = "prodIntent" value=  ${intent === 'add'? `add`: `update`}><br />
            <input type="hidden" name="intent" id = "docId"  ${docId === undefined ? ``: `value= ${docId}`}>
            <button class = "btnNewProd"> Submit </button>
        </form>
      </div>
        `;
    }else if(type==='NMRV'){
        html = `<div class= "core_product_update_product column2">
                <i class="fa fa-window-close delUpdateForm" style="color:red; cursor:pointer"></i>
                <h2>Tambah Product</h2>
                <form id = "formUpdateProduct">
                    ${intent === 'add'? optionValue : ``}
                    <br>
                    <label>Code Barang</label>
                    <input type="text" name="code" id = "prodCode" value= ${data === undefined ? `` : data.code}><br />
                    <label>Tipe</label>
                    <input type="text" name="type" id = "prodType" value="NMRV" style="border:0" readonly><br />
                    <label>Size</label>
                    <input type="number" name="size" id = "prodSize" value= "${data === undefined ? `` : data.size}" placeholder="contoh : 40"><br />
                    <label>Ratio</label>
                    <input type="number" name="ratio" id = "prodRatio" value= "${data === undefined ? `` : data.ratio}" placeholder="contoh : 10"><br />
                    <label>Ukuran Flange</label>
                    <input type="text" name="flange" id = "prodFlange" value= "${data === undefined ? `` : data.flange}" placeholder="contoh : 71B5"><br />            
                    <label>Quantity</label>
                    <input type="number" name="quantity" id = "prodQty" value= "${data === undefined ? `` : data.quantity}"><br />
                    <label>Harga Pricelist</label>
                    <input type="number" name="price" id = "prodPrice" value= "${data === undefined ? `` : data.price}"><br />
                    <input type="hidden" name="intent" id = "prodIntent" value=  ${intent === 'add'? `add`: `update`}><br />
                    <input type="hidden" name="intent" id = "docId"  ${docId === undefined ? ``: `value= ${docId}`}>
                    <button class = "btnNewProd"> Submit </button>
                </form>
            </div>`;
    }else if(type==='NMRV SPAREPART'){
        //console.log(data);
        console.log("producView NMRV parts ContainerOption called");
        html = `<div class= "core_product_update_product column2">
        <i class="fa fa-window-close delUpdateForm" style="color:red; cursor:pointer"></i>
        <h2>Tambah Product</h2>
        <form id = "formUpdateProduct">
            ${intent === 'add'? optionValue : ``}
            <br>
                <label>Code Barang</label>
                <input type="text" name="code" id = "prodCode" value= ${data === undefined ? `` : data.code}><br />
                <input type="text" name="type" id = "prodType" value="NMRV SPAREPART" style="border:0" readonly><br />
                <label>Tipe Part</label>
                <br>
                <select id = partType>
                            <option value="worm" ${data === undefined ? ``: (data.model === `worm` ? `selected = "selected"` : ``)}>Worm</option>
                            <option value="input_shaft" ${data === undefined ? ``: (data.model === `input_shaft` ? `selected = "selected"` : ``)}>Input Shaft</option>
                            <option value="output_shaft" ${data === undefined ? ``: (data.model === `output_shaft` ? `selected = "selected"` : ``)}>Output Shaft</option>
                            <option value="flange" ${data === undefined ? ``: (data.model === `input_flange` ? `selected = "selected"` : ``)}>Input Flange</option>
                            <option value="flange" ${data === undefined ? ``: (data.model === `output_flange` ? `selected = "selected"` : ``)}>Output Flange</option>
                </select>
                <br>
                <label>Size</label>
                <input type="number" name="size" id = "prodSize" value= "${data === undefined ? `` : data.size}" placeholder="contoh : 40"><br />
                <label>Ratio</label>
                <input type="number" name="ratio" id = "prodRatio" value= "${data === undefined ? `` : data.ratio}" placeholder="contoh : 10"><br />
                <label>Ukuran Flange</label>
                <input type="text" name="flange" id = "prodFlange" value= "${data === undefined ? `` : data.flange}" placeholder="contoh : 71B5"><br />            
                <label>Quantity</label>
                <input type="number" name="quantity" id = "prodQty" value= "${data === undefined ? `` : data.quantity}"><br />
                <label>Harga Pricelist</label>
                <input type="number" name="price" id = "prodPrice" value= "${data === undefined ? `` : data.price}"><br />
                <input type="hidden" name="intent" id = "prodIntent" value=  ${intent === 'add'? `add`: `update`}><br />
                <input type="hidden" name="intent" id = "docId"  ${docId === undefined ? ``: `value= ${docId}`}>
                <button class = "btnNewProd"> Submit </button>
                </form>
            </div>`;
    }
    else if(type==='DINAMO'){
        html = `<div class= "core_product_update_product column2">
                <i class="fa fa-window-close delUpdateForm" style="color:red; cursor:pointer"></i>
                <h2>Tambah Product</h2>
                <form id = "formUpdateProduct">
                    ${intent === 'add'? optionValue : ``}
                    <br>
                    <label>Code Barang</label>
                    <input type="text" name="code" id = "prodCode" value= "${data === undefined ? `` : data.code}"><br />
                    <label>Tipe</label>
                    <input type="text" name="type" id = "prodType" value="DINAMO" style="border: 0" readonly><br />
                    <label>Hp</label>
                    <input type="number" name="hp" id = "prodHp" step="0.1" value= "${data === undefined ? `` : data.hp}" placeholder="1 atau 1.5(angka saja)"><br />
                    <label>Rpm</label>
                    <br>
                    <select id = prodModel>
                        <option value="B3" ${data === undefined ? ``: (data.model === `B3` ? `selected = "selected"` : ``)}>B3</option>
                        <option value="B5" ${data === undefined ? ``: (data.model === `B5` ? `selected = "selected"` : ``)}>B5</option>
                    </select>
                    <br>
                    <select id = prodMaterial>
                        <option value="aluminium" ${data === undefined ? ``: (data.material === `aluminium` ? `selected = "selected"` : ``)}>aluminium</option>
                        <option value="iron" ${data === undefined ? ``: (data.material === `iron` ? `selected = "selected"` : ``)}>cast iron</option>
                    </select>
                    <br>
                    <select id = prodRpm>
                        <option value="3000" ${data === undefined ? ``: (data.rpm === `3000` ? `selected = "selected"` : ``)}>3000 Rpm (2Pole)</option>
                        <option value="1500" ${data === undefined ? ``: (data.rpm === `1500` ? `selected = "selected"` : ``)}>1500 Rpm (4Pole)</option>
                        <option value="750" ${data === undefined ? ``: (data.rpm === `750` ? `selected = "selected"` : ``)}>750 Rpm (6Pole)</option>
                    </select>
                    <br>
                    <label>Phasa</label>
                    <br>
                    <select id = prodPhase>
                        <option value="1" ${data === undefined ? ``: (data.phase === `1` ? `selected = "selected"` : ``)}>1 Phasa (220Volt)</option>
                        <option value="3" ${data === undefined ? ``: (data.phase === `3` ? `selected = "selected"` : ``)}>3 Phasa (380Volt)</option>
                    </select>
                    <br>           
                    <label>Quantity</label>
                    <input type="number" name="quantity" id = "prodQty" value= "${data === undefined ? `` : data.quantity}"><br />
                    <label>Harga Pricelist</label>
                    <input type="number" name="price" id = "prodPrice" value= "${data === undefined ? `` : data.price}"><br />
                    <input type="hidden" name="intent" id = "prodIntent" value=  "${intent === 'add'? `add`: `update`}"><br />
                    <input type="hidden" name="intent" id = "docId"  ${docId === undefined ? ``: `value= ${docId}`}>
                    <button class = "btnNewProd"> Submit </button>
                </form>
            </div>`;
    }else if(type==='OTHERS'){
        html = `
        <div class= "core_product_update_product column2">
        <i class="fa fa-window-close delUpdateForm" style="color:red; cursor:pointer"></i>  
        <h2>Tambah Product</h2>
        <form id = "formUpdateProduct">
          ${intent === 'add'? optionValue : ``}
          <br>
          <label>Code Barang</label>
          <input type="text" name="code" id = "prodCode" value= "${data === undefined ? `` : data.code}"><br />
          <label>Tipe</label>
          <input type="text" name="type" id = "prodType" value="OTHERS" style="border:0" readonly><br />
          <label>Spesifikasi</label>
          <input type="text" name="size" id = "prodSpec" placeholder="Spesifikasi lengkap" value= "${data === undefined ? `` : data.spec}" required="required" pattern="[A-Za-z0-9]{1,20}"><br />
          <label>Quantity</label>
          <input type="number" name="quantity" id = "prodQty" value= "${data === undefined ? `` : data.quantity}" required="required" pattern="[A-Za-z0-9]{1,20}"><br />
          <label>Harga Pricelist</label>
          <input type="number" name="price" id = "prodPrice" value= "${data === undefined ? `` : data.price}" required="required" pattern="[A-Za-z0-9]{1,20}"><br />
          <input type="hidden" name="intent" id = "prodIntent" value=  ${intent === 'add'? `add`: `update`}><br />
          <input type="hidden" name="intent" id = "docId"  ${docId === undefined ? ``: `value= ${docId}`}>
          <button class = "btnNewProd"> Submit </button>
      </form>
    </div>`
    }
    return html;

}
export const renderUpdateContainer = (type,intent,data=``) => {

    let html = '';
    if(intent === 'add'){
        if(type !== "begin"){
            //means the type has been changed once    
            html = updateContainerOption(type,intent);
        }else{
            html = `
        <div class= "core_product_update_product column2">
        <i class="fa fa-window-close delUpdateForm" style="color:red; cursor:pointer"></i>
              <h2>Tambah Product</h2>
              <form>
                <select class = "prodSelect">
                    <option value="options">Pilih Produk</option>
                    <option value="WPA">WPA</option>
                    <option value="NMRV">NMRV</option>
                    <option value="DINAMO">DINAMO</option>
                    <option value="WPAPART">WPA SPAREPART</option>
                    <option value="NMRV SPAREPART">NMRV SPAREPART</option>
                    <option value="OTHERS">OTHERS</option>
                </select>
            </form>
          </div>`;
        }
    }else if(intent === 'edit'){
        type = data.data.type; //data is structured -> {code , {data1,data2}}
        //console.log(data);
        console.log("intent is edit and logged");
        html = updateContainerOption(type,intent,data);
    }

    elements.coreContainer.insertAdjacentHTML("beforeend",html);
}
export const deleteProductView = (code) =>{
    //console.log(code);
    const target = document.getElementById(code);
    target.parentNode.parentNode.parentNode.removeChild(target.parentNode.parentNode);
}
