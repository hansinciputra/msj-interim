import {elements, currencyFormat} from "./base";

export const removeCompetitorSearchResult= ()=>{
    let target = document.getElementById("competitorPrice");
    target.parentNode.removeChild(target);
}

const renderSearchResultRow = (data ,dinamoModel) =>{
    if(data.type === 'WPA' || data.type === 'NMRV'){
    return `
            <tr>
                <td>${data.type} ${data.size}</td>
                <td>
                    <div>
                        <label  class = "labelCompetitorPrice">${currencyFormat(data.price)}</label>
                        <input type="hidden" name="docId" value=${data.id}>
                        <input type="hidden" name="competitor" value=${data.competitor}>
                        <input type="number" name = "price" class = "competitorValue hidden" value = "${data.price}">
                    
                    
                </td>
            </tr>
            `;
    }else if(data.type === 'DINAMO'){
    let html;
    console.log("dinamo modeel");   
        if(dinamoModel === 'B3'){
            if(data.model === 'B3'){
                html = `
                    <tr>
                        <td style = "text-align:left">${data.type} ${data.hp}Hp(${data.hp*0.75}Kw) ${data.phasa}Phasa / ${data.model} / ${data.pole}Pole (${data.pole*750}RPM)/ ${data.material}</td>
                        <td>
                            <div>
                                <label  class = "labelCompetitorPrice">${currencyFormat(data.price)}</label>
                                <input type="hidden" name="docId" value=${data.id}>
                                <input type="hidden" name="competitor" value=${data.competitor}>
                                <input type="number" name = "price" class = "competitorValue hidden" value = "${data.price}" min="0.01" step="0.01">
                            </div>
                        </td>
                    </tr>
                    `;               
            }
        }else if(dinamoModel === 'B5'){
            if(data.model === 'B5'){
                html = `
                    <tr>
                        <td style = "text-align:left">${data.type} ${data.hp}Hp(${data.hp*0.75}Kw) ${data.phasa}Phasa / ${data.model} / ${data.pole}Pole (${data.pole*750}RPM)/ ${data.material}</td>
                        <td>
                            <div>
                                <label  class = "labelCompetitorPrice">${currencyFormat(data.price)}</label>
                                <input type="hidden" name="docId" value=${data.id}>
                                <input type="hidden" name="competitor" value=${data.competitor}>
                                <input type="number" name = "price" class = "competitorValue hidden" value = "${data.price}" min="0.01" step="0.01">
                            </div>
                        </td>
                    </tr>
                    `;   
            }
        }
        return html;
    }


}
export const renderCompetitorOptions = () =>{
    let html = `
    <div class = "compatitor_container">
                 <div class="competitor_options">
                    <label>Competitor</label>
                    <select id="competitor_product_name_choice">
                        <option>BARTEX</option>
                        <option>SUMBER</option>
                    </select>
                    <label>Product</label>
                    <select id="competitor_product_type_choice">
                            <option>WPA</option>
                            <option>NMRV</option>
                            <option>DINAMO</option>
                    </select>
                    <span id="dinamo_competitor_choice" class="hidden">
                        <label>Phase</label>
                        <select id= "competitor_product_dinamo_phasa_choice" >
                                <option>3 Phasa</option>
                        </select>
                        <label>Material</label>
                        <select id= "competitor_product_dinamo_material_choice">
                                <option>Aluminium</option>
                                <option>Iron</option>
                        </select>
                        <label>RPM</label>
                        <select id= "competitor_product_dinamo_rpm_choice">
                                <option>3000 RPM</option>
                                <option>1500 RPM</option>
                                <option>750 RPM</option>
                        </select>
                    </span>
                    <button id="competitor_product_search_button">Cari</button>
                </div>
    </div>`;
    elements.coreContainer.insertAdjacentHTML("afterbegin",html);
}
export const renderSearchResult = (data) =>{
    let html;
    if(data[0].type === 'DINAMO'){
        html = `
                        <div id = "competitorPrice">
                        <h3>${data[0].competitor} ${data[0].type}</h3>
                        <h4>B3</h4>
                        <table>
                            <tr>
                                <th>Tipe</th>
                                <th>Harga</th>
                            </tr>         
                            ${data.map(cur=>renderSearchResultRow(cur,'B3')).join('')}               
                        </table>
                        <h4>B5</h4>
                        <table>
                            <tr>
                                <th>Tipe</th>
                                <th>Harga</th>
                            </tr>         
                            ${data.map(cur=>renderSearchResultRow(cur,'B5')).join('')}               
                        </table>
                        `;   

    }else{
        html = `
                        <div id = "competitorPrice">
                        <h3>${data[0].competitor} ${data[0].type}</h3>
                        <table>
                            <tr>
                                <th>Tipe</th>
                                <th>Harga</th>
                            </tr>         
                            ${data.map(cur=>renderSearchResultRow(cur)).join('')}               
                        </table>
                        `;               
    }
    document.querySelector('.compatitor_container').insertAdjacentHTML("beforeend",html);
    
}