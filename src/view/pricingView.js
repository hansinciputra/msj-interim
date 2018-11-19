import {elements, currencyFormat} from "./base";

export const removePricingContainer = () =>{
    let target = document.querySelector('.pricingContainer');
    if(target){
        target.parentNode.removeChild(target);
    }
};
export const removePricingResult = () =>{
    let target = document.querySelector('.pricingResult');
    if(target){
        target.parentNode.removeChild(target);
    }
};
const renderResultRow = cur =>{
    //console.log(cur);
    if(cur.type === 'WPA'){
        return  `<tr>
                        <td>${cur.code}</td>
                        <td style = "text-align: left;">${cur.type} 0${cur.size} Ratio 1 : ${cur.ratio} </td>
                        <td>${cur.quantity}</td>
                    </tr>`;
    }else if(cur.type === 'NMRV'){
        return  `<tr>
                        <td>${cur.code}</td>
                        <td style = "text-align: left;">${cur.type} 0${cur.size} Ratio 1 : ${cur.ratio} [${cur.flange}]</td>
                        <td>${cur.quantity}</td>
                    </tr>`;
    }else if(cur.type === 'DINAMO'){
        return  `<tr>
                        <td>${cur.code}</td>
                        <td style = "text-align: left;">${cur.type} ${cur.phase} ${cur.hp}Hp(${cur.hp*0.75}KW) ${cur.rpm}RPM(${cur.rpm/750}POLE)</td>
                        <td>${cur.quantity}</td>
                    </tr>`;
    }
    
};
const renderSparepartRow = cur =>{
    //console.log(cur);
    if(cur.type === 'WPA SPAREPART'){
        return  `<tr>
                        <td>${cur.code}</td>
                        <td style = "text-align: left;">${cur.type} ${cur.partType} 0${cur.size} Ratio 1 : ${cur.ratio} </td>
                        <td>${cur.quantity}</td>
                    </tr>`;
    }else if(cur.type === 'NMRV SPAREPART'){
        return  `<tr>
                        <td>${cur.code}</td>
                        <td style = "text-align: left;">${cur.type} ${cur.partType} 0${cur.size} Ratio 1 : ${cur.ratio} [${cur.flange}]</td>
                        <td>${cur.quantity}</td>
                    </tr>`;
    }else{
        console.log("no sparepart");
        return  ``;
    }
    
};
const calculateTotal = (data) => {
    //code to calculate total quantity
    let sum = 0;
    
    data.forEach(cur=>{
        sum = sum + parseInt(cur.quantity,10);
    });
    console.log(sum);
    return sum;
};
const calculateAverage = (data) =>{
    //code to calculate average quantity

    let sum = 0;
    
    data.forEach(cur=>{
        sum = sum + parseInt(cur.price,10);
    });
    let jumlahtipe = Object.keys(data).length
    let average = sum / jumlahtipe;
    return average;
    //let average = sum / data.length
};
export const renderPricingResult = (data,bartexPrice,sumberPrice,sparepartData =``) =>{
    let temp = Array.from(data);
    let part = Array.from(sparepartData);
    //console.log(temp);
    let html = `
    <div class = "pricingResult">
    <fieldset>
        <legend>Perbandingan</legend>
        <table id = "pricingResultContainer " class = "font-10vw pricingTable">
            <tr>
                <th class = "title">Code</th>
                <th class = "title">Tipe</th>
                <th class = "title">Stock</th>
            </tr>
            ${temp.map(cur=>renderResultRow(cur)).join('')}
            <tr>
                    <td colspan="2" class = "title">Total Stock Tersedia</td>
                    <td id = "total_stock_available" class = "title border-up-bottom">${calculateTotal(data)} Unit</td>
            </tr>
        </table>     
        <table id = "pricingCompetitor" class = "font-10vw pricingTable">
                <tr>
                    <th class = "title">WD</th>
                    <th class = "title">Bartex</th>
                    <th class = "title">Sumber</th>
                </tr>
                <tr>
                    <td id = "wd_unit_price">${currencyFormat(calculateAverage(data))}</td>
                    <td id = "bartex_unit_price">${currencyFormat(bartexPrice)}</td>
                    <td id = "sumber_unit_price">${currencyFormat(sumberPrice)}</td>
                </tr>
                
                <tr>
                        <td><input type="number" id= "wd_prcn_dsc1" style="text-align: center; font-size: 0.9rem;"><span>% Disc</span></td>
                        <td><input type="number" id = "bartex_prcn_up" style="text-align: center; font-size: 0.9rem;"><span>% Up</span></td>
                        <td><input type="number" id = "sumber_prcn_up" style="text-align: center; font-size: 0.9rem;"><span>% Up</span></td>
                </tr>
                
                <tr>
                        <td><input type="number" id= "wd_prcn_dsc2" style="text-align: center; font-size: 0.9rem;">  + % Disc</td>
                        <td></td>
                        <td></td>
                </tr>
                <tr>
                        <td id = "wd_final_price" class="border-up-bottom" style="font-size:1rem;">${currencyFormat(calculateAverage(data))}</td>
                        <td id = "bartex_final_price" class="border-up-bottom" style="font-size:1rem;">${currencyFormat(bartexPrice)}</td>
                        <td id = "sumber_final_price" class="border-up-bottom" style="font-size:1rem;">${currencyFormat(sumberPrice)}</td>
                </tr>      
        </table>
            <br>
            <br>
            <h4>Total Spareparts Tersedia</h4>
            <table id = "SparePartResultContainer " class = "font-10vw pricingTable">
                <tr>
                    <th class = "title">Code</th>
                    <th class = "title">Tipe</th>
                    <th class = "title">Stock</th>
                </tr>
                ${part.map(cur=>renderSparepartRow(cur)).join('')}
            </table>
        </div>
    </fieldset>
    </div>
    `
    document.querySelector('.pricingContainer').insertAdjacentHTML("beforeend",html);
};
export const renderNewPricingContainer= () =>{
    let html = `
    <div class = "pricingContainer">
    <div class = "pricingProductSelection">
                <form>
                    <select class = "pricingProdSelect width100 font2rem">
                        <option value="options">Pilih Produk</option>
                        <option value="WPA">WPA</option>
                        <option value="NMRV">NMRV</option>
                        <option value="DINAMO">DINAMO</option>
                    </select>
                </form>
    `;
    elements.coreContainer.insertAdjacentHTML("afterbegin",html);
};
export const renderNewPricingProductSelection = (prod) =>{
    let html = ``;
    if(prod === 'WPA'){
        html = `
        <div class = "pricingContainer">
        <div class = "pricingProductSelection">
                <form>
                    <select class = "pricingProdSelect width100 font2rem">
                        <option value="options">Pilih Produk</option>
                        <option value="WPA">WPA</option>
                        <option value="NMRV">NMRV</option>
                        <option value="DINAMO">DINAMO</option>
                    </select>
                    <br>
                    <label>Tipe</label>
                    <input type="text" name="type" id = "prodType" class="title" value="WPA" style="border: 0; background-color:black; color:white;" readonly><br />
                    <label>Size</label>
                    <input type="number" name="size" id = "prodSize" placeholder="40 , 50, 60(angka saja)"><br />
                    <label>Ratio</label>
                    <input type="number" name="ratio" id = "prodRatio" placeholder="10 , 20, 30(angka saja)"><br />
                    <br>
                    <button class = "btnGetPricing width100 font2rem"> Submit </button>
                </form>
            </div>
        `;
    }else if(prod === 'NMRV'){
        html = `
        <div class = "pricingContainer">
        <div class = "pricingProductSelection">
                <form>
                    <select class = "pricingProdSelect width100 font2rem">
                        <option value="options">Pilih Produk</option>
                        <option value="WPA">WPA</option>
                        <option value="NMRV">NMRV</option>
                        <option value="DINAMO">DINAMO</option>
                    </select>
                    <br>
                    <label>Tipe</label>
                    <input type="text" name="type" id = "prodType" class="title" value="NMRV" style="border: 0; background-color:black; color:white;" readonly><br />
                    <label>Size</label>
                    <input type="number" name="size" id = "prodSize" placeholder="40 , 50, 60(angka saja)"><br />
                    <label>Ratio</label>
                    <input type="number" name="ratio" id = "prodRatio" placeholder="10 , 20, 30(angka saja)"><br />
                    <label>Ukuran Flange</label>
                    <input type="text" name="flange" id = "prodFlange" placeholder="63B5, 71B5"><br />
                    <br>
                    <button class = "btnGetPricing width100 font2rem"> Submit </button>
                </form>
            </div>
        `;
    }else if(prod === 'DINAMO'){
        html = `
        <div class = "pricingContainer">
        <div class = "pricingProductSelection">
                <form>
                    <select class = "pricingProdSelect width100 font2rem">
                        <option value="options">Pilih Produk</option>
                        <option value="WPA">WPA</option>
                        <option value="NMRV">NMRV</option>
                        <option value="DINAMO">DINAMO</option>
                    </select>
                    <br>
                    <label>Tipe</label>
                    <input type="text" name="type" id = "prodType" class="title" value="DINAMO" style="border: 0; background-color:black; color:white;" readonly><br />
                    <label>Hp</label>
                    <input type="number" name="hp" id = "prodHp" step="0.1" placeholder="1 atau 1.5(angka saja)"><br />
                    <br>
                    <label>MODEL</label>
                    <br>
                    <select id = prodModel class= "width100 font2rem">
                        <option value="B3">B3</option>
                        <option value="B5">B5</option>
                    </select>
                    <br>
                    <label>MATERIAL</label>
                    <br>
                    <select id = prodMaterial class= "width100 font2rem">
                        <option value="aluminium">aluminium</option>
                        <option value="iron">cast iron</option>
                    </select>
                    <br>
                    <label>SPEED</label>
                    <br>
                    <select id = "prodRpm" class= "width100 font2rem">  
                        <option value="3000">3000 Rpm (2Pole)</option>
                        <option value="1500">1500 Rpm (4Pole)</option>
                        <option value="750">750 Rpm (6Pole)</option>
                    </select>
                    <br>
                    <label>Phasa</label>
                    <br>
                    <select id = "prodPhase" class= "width100 font2rem">
                        <option value="1" >1 Phasa (220Volt)</option>
                        <option value="3" selected >3 Phasa (380Volt)</option>
                    </select>
                     
                    <button class = "btnGetPricing width100 font2rem"> Submit </button>           
                </form>
            </div>
        `;
    }
    elements.coreContainer.insertAdjacentHTML("afterbegin",html);
    
};
export const renderDiscountResult = (amount, percentage) =>{
    let result = amount - (amount * percentage/100);
    return result;
};
export const renderUpMarginResult = (amount, percentage) =>{
    let result = amount + (amount * percentage/100);
    return result;
};
