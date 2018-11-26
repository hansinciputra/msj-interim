import { elements } from "./base";
import moment from  'moment';

export const deleteRowRecord = (target) =>{
    if(target){
        //console.log(target.parentNode);
        target.parentNode.removeChild(target);
    }else{
        let target = document.querySelector('.newChecker');
        if(target){
            target.parentNode.removeChild(target);
        }
    }
}
export const renderWarehouseContainer = ()=>{
    let html =`
        <div class = "warehouseContainer">
            <fieldset>
                <legend>Tanggal</legend>
                <div>
                <form>
                    <input id= "warehouseMonth" type="month" required">
                </form>
                    <input id="warehouseOutButton" type="button" value="KELUAR BARANG">
                    <input id="warehouseInButton" type="button" value="MASUK BARANG">
                </div>
            </fieldset>
            <table id="warehouseTable" class ="minWidthTable marginTop30px">
                <tr>
                    <th>Tanggal</th>
                    <th>CODE</th>
                    <th>BARANG</th>
                    <th>SISA STOCK</th>
                    <th>In/Out</th>
                    <th>Nama Customer</th>
                    <th>_____</th> 
                </tr>
            </table>
    </div>`
    elements.coreContainer.insertAdjacentHTML("afterbegin",html);
}
export const renderCodeRow = (instruction,data)=>{
    console.log(moment().format('L'));
    let html =``;
    if(data){
        //code for : after user insert data into db, we redisplay the user input into the view
        html = `
        <tr class=${data.intent} id="finalInputRow">
                        <td id="warehouseDate">${data.tanggal}</td>
                        <td style="text-align:left" class= "tableSmallWidth">${data.code}</td>
                        <td style="text-align:left;padding-left:10px;" class= "tableMediumWidth">${data.desc}</td>
                        <td class= "tableSmallWidth">${data.sisaStock}</td>
                        <td class= "tableSmallWidth">${data.enteredAmount}<input type="number" class="smallInput hidden" value=${data.enteredAmount}></td>
                        <td style="text-align:left;" class= "tableLongWidth">${data.customer}<input type="text" class="longInput hidden" value = "${data.customer}"></td>
                        <td class= "tableSmallWidth">
                            <input type="hidden" name ="docId" class="prevValue" value = ${data.docId}>
                            <i class="fa fa-edit editWarehouseRecord" id = "" style="cursor:pointer;font-size:24px;color:blue;float:left;"></i>
                            <span class="hidden warehouse_input_hook"><i class="fa fa-truck updateAmountWarehouseRecord" id = "" style="cursor:pointer;font-size:24px;color:green;float:left;"></i></span>
                            <i class="fa fa-trash-o deleteWarehouseRecord" id = "" style="cursor:pointer;font-size:24px;color:red;float:right;"></i>
                            <input type="hidden" name ="mapId" class="prevValue" value = "${data.mapId}">
                        </td>
            </tr>
        `;

    }else{
        //code for initial search, when ask user to insert product code
        if(instruction === 'KELUAR BARANG'){
            html = `
            <tr class="rowKeluarBarang" id="rowForCodeInput">
                        <td><input id= "warehouseDate" type="date" required value="${moment().format("YYYY-MM-DD")}"></td>
                        <td style="text-align:left" class= "tableSmallWidth"><input type="text" class="codeBarangWarehouse max100width"></td>
                        <td style="text-align:left;padding-left:10px;" class= "tableMediumWidth"></td>
                        <td class= "tableSmallWidth"></td>
                        <td class= "tableSmallWidth"></td>
                        <td style="text-align:left; class= "tableLongWidth"></td>
                        <td class= "tableSmallWidth">
                            
                            <i class="fa fa-trash-o deleteWarehouseRecord" id = "" style="cursor:pointer;font-size:24px;color:red;float:right;"></i>
                        </td>
            </tr>`;
    
        }else if(instruction === 'MASUK BARANG'){
            html = `
            <tr class="rowMasukBarang" id="rowForCodeInput">
                        <td><input id= "warehouseDate" type="date" required value="${moment().format("YYYY-MM-DD")}"></td>
                        <td style="text-align:left" class= "tableSmallWidth"><input type="text" class="codeBarangWarehouse max100width"></td>
                        <td style="text-align:left;padding-left:10px;" class= "tableMediumWidth"></td>
                        <td class= "tableSmallWidth"></td>
                        <td class= "tableSmallWidth"></td>
                        <td class= "tableLongWidth"></td>
                        <td style="text-align:left; class= "tableSmallWidth">
                            
                            <i class="fa fa-trash-o deleteWarehouseRecord" id = "" style="cursor:pointer;font-size:24px;color:red;float:right;"></i>
                        </td>
            </tr>`;
        }
    }
    document.getElementById('warehouseTable').insertAdjacentHTML("beforeend",html);
}
const getTableIndex = ()=>{
    let table = document.getElementById('warehouseTable');
    return table.rows.length;
}

export const prepareUpdateAmountRecordView = (el,stock) =>{
        let prevEnteredAmount = el.parentNode.parentNode.childNodes[9].childNodes[0];
        let namaCustomer = el.parentNode.parentNode.childNodes[11].childNodes[0];
        let newEnteredAmount = el.parentNode.parentNode.childNodes[9].childNodes[1];
        let newNamaCustomer = el.parentNode.parentNode.childNodes[11].childNodes[1];
        let greenTruck = el.parentNode.parentNode.childNodes[13].childNodes[3];
        let editButton = el.parentNode.parentNode.childNodes[13].childNodes[5];
        let availableStock = el.parentNode.parentNode.childNodes[7];
        let tanggal = document.getElementById('warehouseDate').innerHTML;
        //delete old element
        
        let prevAmount = parseInt(prevEnteredAmount.nodeValue,10);
        let html = `
            <input name = "preAmount" type = "hidden" value =${prevAmount}>
            <input type=hidden id = 'warehouseDate' value = ${tanggal}> 
        `;
        prevEnteredAmount.parentNode.removeChild(prevEnteredAmount);
        namaCustomer.parentNode.removeChild(namaCustomer);
        greenTruck.parentNode.removeChild(greenTruck);
        //add new element
        availableStock.innerHTML = stock;
        editButton.insertAdjacentHTML("beforeend",html);
        newEnteredAmount.classList.remove("hidden");
        newNamaCustomer.classList.remove("hidden");
        editButton.classList.remove("hidden");
        //console.log(prevAmount);

        //2. perform update on the db when updateAmountWarehouseRecord is pressed    
}

//code for when upload pressed(green truck)
export const renderResultRow = (data,tanggal)=>{
    let newTypeProd;
    
    if(data.type === "WPA"){
        newTypeProd = `${data.type} 0${data.size} ratio 1 : ${data.ratio}`;
    }else if(data.type === "NMRV"){
        newTypeProd = `${data.type} 0${data.size} ${data.flange} ratio 1 : ${data.ratio}`;
    }else if(data.type === "DINAMO"){
        newTypeProd = `${data.type} ${data.phase}Phasa / ${data.model} / ${data.hp} HP(${data.hp*0.75}KW) / ${data.rpm}rpm / ${data.material}`;
    }else{
        console.log("No Entry");
    }
    //console.log(newTypeProd);
    let html = `
        <tr class="${data.intent} newChecker">
                    <td>${tanggal}</td>
                    <input class = 'WarehouseRowdocId' type="hidden" name="id" value="${data.docId}">
                    <td style="text-align:left;" class= "tableSmallWidth"><label>${data.code}</label><input type="text" class="codeBarangWarehouse hidden max100width"></td>
                    <td style="text-align:left;padding-left:10px;" class= "tableMediumWidth">${newTypeProd}</td>
                    <td class= "tableSmallWidth">${data.stock}</td>
                    <td class= "tableSmallWidth"><input type="number" class="smallInput"></td>
                    <td style="text-align:left; class= "tableLongWidth"><input type="text" class="longInput"></td>
                    <input type="hidden" class="prevValue" value = "">
                    <td class= "tableSmallWidth">
                        <i class="fa fa-truck submitWarehouseRecord lastChecker" id = "" style="cursor:pointer;font-size:24px;color:green;float:left;"></i>
                        <i class="fa fa-trash-o deleteWarehouseRecord" id = "" style="cursor:pointer;font-size:24px;color:red;float:right;"></i>
                        <input type=hidden id = 'warehouseDate' value = ${tanggal}>
                    </td>
        </tr>`;
    document.getElementById('warehouseTable').insertAdjacentHTML("beforeend",html);
}

export const deleteLastRow = ()=>{
    let table = document.getElementById('warehouseTable');
    let rowCount = table.rows.length;
    table.deleteRow(rowCount - 1);
}
export const noRecordNotif = (date) =>{
    let html = `
        <h3 id="noRecordNotif">PERHATIAN! Belum ada catatan transaksi untuk tanggal ${date}</h3>
    `
    document.querySelector('.core_container').insertAdjacentHTML("afterbegin",html);
}
export const clearRecordTable = () =>{
    let target = document.getElementById('noRecordNotif');
    let rowKeluar = document.getElementsByClassName('rowKeluarBarang');
    let rowMasuk = document.getElementsByClassName('rowMasukBarang');
    let rowForCodeInput = document.getElementById('rowForCodeInput');
    if(rowForCodeInput){
        //console.log("masuk sini");
        rowForCodeInput.parentNode.removeChild(rowForCodeInput);
    }
    if(target){
        target.parentNode.removeChild(target);    
    }else{
        if(rowKeluar || rowMasuk){
            if(rowKeluar){
                while(rowKeluar[0]){             
                    rowKeluar[0].parentNode.removeChild(rowKeluar[0]);
                }
            }
            if(rowMasuk){
                while(rowMasuk[0]){            
                    rowMasuk[0].parentNode.removeChild(rowMasuk[0]);
                }
            }
        }
    }
}
