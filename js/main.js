//載入地圖
const map = L.map('map', { zoomControl: false }).setView([0, 0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors:<a href="https://github.com/fred39392001">ABow_Chen</a>'
}).addTo(map);

const violetIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const marker = L.marker([0, 0] , {icon:violetIcon}).addTo(map);

//定位使用者位置
if ('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(position => {
    userLat = position.coords.latitude;
    userLng = position.coords.longitude;
    console.log(userLat, userLng);
    map.setView([userLat, userLng], 13);
    marker.setLatLng([userLat,userLng]).bindPopup(
        `<h3>你的位置</h3>`)
        .openPopup();
    });
} else {
    console.log('geolocation not available');
}

//新增定位按鈕
let geoBtn = document.getElementById('jsGeoBtn');
geoBtn.addEventListener('click',function(){
    map.setView([userLat, userLng], 13);
    marker.setLatLng([userLat,userLng]).bindPopup(
        `<h3>你的位置</h3>`)
        .openPopup();
},false);


//定義marker顏色
let mask;

const greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const orangeIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


const redIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

//取出全國藥局JSON資料至全域變數
let data;

function getData(){
    const xhr = new XMLHttpRequest;
    //xhr.open('get','https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json',true)
	//xhr.open('get','https://raw.githubusercontent.com/hikari0329/epaymask/gh-pages/mask_data_e01.json',true);
	xhr.open('get','https://raw.githubusercontent.com/hikari0329/epaymask/gh-pages/epay_data_all_trim.json',true);
    xhr.send(null);
    xhr.onload = function(){
        document.querySelector('.loader').style.display = 'none';
        data = JSON.parse(xhr.responseText);
        L.control.zoom({ position: 'topright' }).addTo(map);
        addMarker();
        //renderList('竹山鎮','南投縣');
        //addCountyList();
    }
}

function init(){
    //renderDate();
    getData();
}

init();

//將marker群組套件載入
const markers = new L.MarkerClusterGroup({ disableClusteringAtZoom: 18 }).addTo(map);

var latx= 0;
var lngy= 0;
function getLoc(addr){
	alert(addr);
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode(
		{'address' : addr },
		function (results, status) {
			//alert(status);
			if (status == google.maps.GeocoderStatus.OK) {
				//alert("OK");
				//var loc = results[0].geometry.location;
				latx = results[0].geometry.location.lat();
				lngy = results[0].geometry.location.lng();
				//alert(location.Pa);
				// location.Pa 緯度
				// location.Qa 經度
				//alert(latx);

			} else {
				//alert(addr);
				//alert(results[0].geometry.location.Pa);
				alert('解析失敗!回傳狀態為：' + status);
			}
		}	
	);
}

//倒入全國藥局資料並標上marker
function addMarker(){
	//getLoc("台北市大安區忠孝東路三段100號");
	//alert(latx);
	//alert(lngy);
    for(let i = 0;i<data.length;i++){
        const pharmacyName = data[i].營業人名稱; //.properties.營業人名稱;
        //const maskAdult = data[i].mask_adult;
        //const maskChild = data[i].mask_child;
        const lat = data[i].logy;
        const lng = data[i].latx;
        //alert(lat);
		//alert(lng);	
        const pharmacyAddress = data[i].營業人地址;
		//alert(pharmacyAddress);	
        //const pharmacyPhone = data[i].phone;
        const pharmacyNote = data[i].接受行動支付工具;
		
		mask = greenIcon;
		 /** 
        if(maskAdult == 0 || maskChild == 0){
            mask = redIcon;
        }else if (maskAdult < 100 && maskAdult !== 0 || maskChild < 100 && maskChild !== 0){
            mask = orangeIcon;
        }else{
            mask = greenIcon;
        }
		*/
        let maskAdultJudge;
        let maskChildJudge;
		maskAdultJudge = 'bg-sufficient';
		maskChildJudge = 'bg-sufficient';
		
		 /**
        if (maskAdult >= 100) {
            maskAdultJudge = 'bg-sufficient';
        } else if (maskAdult < 100 && maskAdult !== 0) {
            maskAdultJudge = 'bg-insufficient';
        } else {
            maskAdultJudge = 'bg-none';
        }
        if (maskChild >= 100) {
            maskChildJudge = 'bg-sufficient';
        } else if (maskChild < 100 && maskChild !== 0) {
            maskChildJudge = 'bg-insufficient';

        } else {
            maskChildJudge = 'bg-none';
        }
		*/
		let URL;
		URL = "https://www.google.com.tw/maps/place/" + pharmacyAddress;
        markers.addLayer(L.marker([lat,lng], {icon: mask}).bindPopup(
            // `<p style="text-align:center; font-weight:bold; font-size:1.5em; margin:15px 0;">${pharmacyName}</p>
            // <div class="popupBtn">
            // <span class="${maskAdultJudge} pop-style">成人:${maskAdult}</span>
            // &nbsp;<span class="${maskChildJudge} pop-style">兒童:${maskChild}</span>
            // </div>`
            `<div class="popupInfo">
            <p class="popupTitle" data-name="${pharmacyName}"><span>${pharmacyName}</span></p>
            <hr>
            <p class="popupText"><i class="fas fa-map-marker-alt"></i><a target="_blank" href=${URL}">${pharmacyAddress}</a></p>
			<hr>
            <p class="popupNote"><h1>行動支付工具:${pharmacyNote}</h1></p>
            `
        ));
    }
    map.addLayer(markers);
}

//在panel印出今天日期
function renderDate(){
    const dateInfo = new Date();
    const day = dateInfo.getDay();
    let date = dateInfo.getDate();
    let month = dateInfo.getMonth()+1;
    let year = dateInfo.getFullYear();
    const dayChinese = judgeChineseDay(day);
    const twoWeeks = 1000 * 60 * 60 * 24 * 14;
    const twoWeeksDate = new Date(new Date().getTime() + twoWeeks);
    let nextBuyTimeDate = twoWeeksDate.getDate();
    let nextBuyTimeMonth = twoWeeksDate.getMonth() + 1;
    let nextBuyTimeYear = twoWeeksDate.getFullYear();
    let today;
    let nextBuyDate;
    if(month.toString().length == 1){
        month = '0' + month;
        }
    if(date.toString().length == 1){
        date = '0' + date;
        }
    today = year + '-' + month + '-' + date;

    if (nextBuyTimeMonth.toString().length == 1) {
        nextBuyTimeMonth = '0' + nextBuyTimeMonth;
    }
    if (nextBuyTimeDate.toString().length == 1) {
        nextBuyTimeDate = '0' + nextBuyTimeDate;
    }
    nextBuyDate = nextBuyTimeYear + '-' + nextBuyTimeMonth + '-' + nextBuyTimeDate;
    // if(nextBuyTimeMonth == '10' || nextBuyTimeMonth == '11' || nextBuyTimeMonth == '12'){
    //     nextBuyDate = nextBuyTimeYear + '-' + (nextBuyTimeMonth+1) + '-' + nextBuyTimeDate;
    //     }else{
    //     nextBuyDate = nextBuyTimeYear + '-0' + (nextBuyTimeMonth+1) + '-' + nextBuyTimeDate;
    // }
    if(day == 1 || day == 3 || day == 5){
        // document.querySelector('.idNumOdd').style.display = 'block';
        document.querySelector('.idNumAll').style.display = 'block';
    }else if(day == 2 || day == 4 || day == 6){
        // document.querySelector('.idNumEven').style.display = 'block';
        document.querySelector('.idNumAll').style.display = 'block';
    }
    else if(day == 0){
        document.querySelector('.idNumAll').style.display = 'block';
    }else{
        alert('沒有這一天');
    }
        document.querySelector('.todayDate h2 span').textContent = today;
        document.querySelector('.infoWeek h2 span').textContent = dayChinese;
        document.querySelector('.nextBuyDate span').textContent = nextBuyDate;
        document.querySelector('.nextBuyDay').textContent = dayChinese;
    }

// 收合選單
const toggle_btn = document.querySelector('.js_toggle');
const panel = document.querySelector('.panel');
toggle_btn.onclick = function(e) {
    // e.preventDefault();
    panel.classList.toggle("panelClose");

};

//判斷星期幾並把數字轉成中文字
function judgeChineseDay(day){
    switch(day){
        case 1:
            return '一';
            break;
        case 2:
            return '二';
            break;
        case 3:
            return '三';
            break;
        case 4:
            return '四';
            break;
        case 5:
            return '五';
            break;
        case 6:
            return '六';
            break;
        case 0:
            return '日';
            break;
    }

}


//縣市選單
const countySelector = document.querySelector('.countyList');
function addCountyList(){
    let allCounty = [];
    let countyStr='';
    countyStr += '<option>請選擇縣市</option>'
    for(let i=0;i<data.length;i++){
        const countyName = data[i].county;
        if(allCounty.indexOf(countyName) == -1 && countyName !== ''){
        allCounty.push(countyName);
        countyStr += `<option value="${countyName}">${countyName}</option>`
        }
    }
    countySelector.innerHTML = countyStr;
}
countySelector.addEventListener('change', addTownList);

const townSelector = document.querySelector('.townList');
townSelector.innerHTML = `<option value="">請選擇鄉鎮區</option>`;

function addTownList(e){
    let countyValue = e.target.value;
    let townStr = `<option value="">請選擇鄉鎮區</option>`;
    let allTown = [];
    let newTownList = '';
    for (let i = 0; i < data.length; i++) {
        let countyMatch = data[i].county;
        if (countyValue == countyMatch) {
            allTown.push(data[i].town);
        }
    }

    newTownList = new Set(allTown);
    newTownList = Array.from(newTownList);
    for (let i = 0; i < newTownList.length; i++) {
        townStr += `<option value="${newTownList[i]}">${newTownList[i]}</option>`
    }

    townSelector.innerHTML = townStr;
    townSelector.addEventListener('change', geoTownView);

}

//選好鄉鎮後，定位至該鄉鎮
function geoTownView(e) {
    let town = e.target.value;
    let townLatLng = [];
    let county = '';

    for (let i = 0; i < data.length; i++) {
        let townTarget = data[i].town;
        let countyTarget = data[i].county;
        let lat = data[i].geometry.coordinates[0];
        let lng = data[i].geometry.coordinates[1];

        if (townTarget == town && countyTarget == countySelector.value) {
            townLatLng = [lng, lat];
            county = data[i].county;
        }
    }
    map.setView(townLatLng, 17);
    //renderList(town,county);
}

//在左邊欄印出藥局名稱
function renderList(town,county){
    let str = '';
    for(let i = 0;i<data.length;i++){
        const countyName = data[i].county;
        const townName = data[i].town;
        const pharmacyName = data[i].營業人名稱;
        const maskAdult = data[i].mask_adult;
        const maskChild = data[i].mask_child;
        const pharmacyAddress = data[i].營業人地址;
        const pharmacyPhone = data[i].phone;
        const pharmacyNote = data[i].note;
        let maskAdultJudge;
        let maskChildJudge;

        if (maskAdult >= 100) {
            maskAdultJudge = 'bg-sufficient';
        } else if (maskAdult < 100 && maskAdult !== 0) {
            maskAdultJudge = 'bg-insufficient';
        } else {
            maskAdultJudge = 'bg-none';
        }
        if (maskChild >= 100) {
            maskChildJudge = 'bg-sufficient';
        } else if (maskChild < 100 && maskChild !== 0) {
            maskChildJudge = 'bg-insufficient';

        } else {
            maskChildJudge = 'bg-none';
        }
        if(countyName == county && townName == town){
            str+=`<ul class="maskContent">
            <div class="pharmacyTitle" data-lat="${data[i].geometry.coordinates[1]}" data-lng="${data[i].geometry.coordinates[0]}">
            <li data-name="${pharmacyName}"><span>${pharmacyName}</span></li>
            <p class="infoText"><i class="fas fa-map-marker-alt"></i> ${pharmacyAddress}</p>
            <p class="noteText"> ${pharmacyNote}</p>
            <div class="panelMaskNum" data-name="${pharmacyName}">
            <div class="${maskAdultJudge}">
            <div class="infoLayout">
            <img class="adultIcon" src="img/adultIcon.svg" alt="">
            <p>${maskAdult}</p>
            </div>
            </div>
            &nbsp;<div class="${maskChildJudge}">
            <div class="infoLayout">
            <img class="kidIcon" src="img/kidIcon.svg" alt="">
            <p>${maskChild}</p>
            </div>
            </div>
            </div>
            </div>
            </ul>`
        }
    }
        document.querySelector('.pharmacyList').innerHTML = str;
        var pharmacyTitle = document.querySelectorAll('.pharmacyTitle'); 
        var pharmacyNameList = document.querySelectorAll('.maskContent'); 
        clickPharmacyGeo(pharmacyTitle, pharmacyNameList);
}

function clickPharmacyGeo(pharmacyTitle, pharmacyNameList){
    for(let i=0;i<pharmacyNameList.length;i++){
        pharmacyTitle[i].addEventListener('click',function(e){
            Lat = Number(e.currentTarget.dataset.lat);
            Lng = Number(e.currentTarget.dataset.lng);
            map.setView([Lat, Lng], 20);
            markers.eachLayer(function (layer) {
                const layerLatLng = layer.getLatLng();
                if (layerLatLng.lat == Lat && layerLatLng.lng == Lng) {
                  layer.openPopup();
                }
              });
    })
}
}