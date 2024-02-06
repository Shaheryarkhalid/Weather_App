navigator.geolocation.getCurrentPosition(position=>{
    Automatic_Location(position.coords.latitude, position.coords.longitude);
});
function Automatic_Location(latitude,longitude)
{
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,cloud_cover,snowfall&timezone=auto`)
    .then(res=>res.json())
    .then(data=>{

        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
        .then(response=>response.json())
        .then(dat=>{
            console.log(dat);
            
            
            document.getElementById('City-Country').innerHTML=dat["city"]+" - "+dat["countryCode"];
            if(!data.current['is_day']){
                document.querySelector('.Main-Section .Content-Wrapper').setAttribute("style","background-image:url('./Realted_Media/stars.png')");
            }else{
                document.querySelector('.Main-Section .Content-Wrapper').setAttribute("style","background-image:')");
            }
            let time=data.current["time"].split("T")[1].split(":")[0];
            document.querySelector('section.Main-Section').setAttribute("class",`Main-Section g${time}`);


            if(!data.current['rain']&&!data.current['showers']&&!data.current['snowfall']){
                if(data.current['cloud_cover']>50)
                {
                    document.getElementById("Weather-Img").setAttribute("src",`./Realted_Media/${data.current['is_day']}/clouds.png`);
                }else{
                    document.getElementById("Weather-Img").setAttribute("src",`./Realted_Media/${data.current['is_day']}/clear.png`);
                }
            }else if(data.current['rain']){
                document.getElementById("Weather-Img").setAttribute("src",`./Realted_Media/${data.current['is_day']}/rain.png`);
            }else if(data.current['showers']){
                document.getElementById("Weather-Img").setAttribute("src",`./Realted_Media/${data.current['is_day']}/drizzle.png`);
            }else if(data.current['snowfall']){
                document.getElementById("Weather-Img").setAttribute("src",`./Realted_Media/${data.current['is_day']}/snow.png`);
            }

            for (const key in data.current) {
                console.log(key+" : "+data.current[key]+ data.current_units[key])
                let s=document.getElementById(key);
                if(s)
                {
                    s.innerHTML=data.current[key]+data.current_units[key];
                }
            }
        })
        
    });
}
document.getElementById("Search").addEventListener('keyup',Search_City_Country);
let x="https://geocoding-api.open-meteo.com/v1/search?name=";
function Search_City_Country()
{
    document.getElementById('Return_Data').innerHTML='';
    let Query=x+document.getElementById('Search').value;
    fetch(Query)
    .then(res=>res.json())
    .then(data=>{
        if(data.results)
        {
            console.log(data);
            for(let i=0;i<3;i++)
            {
                document.getElementById('Return_Data').innerHTML+=`<div class="Country-Return" onclick="Fecth_Using_User_Coordinates(${data.results[i]["longitude"]},${data.results[i]["latitude"]},'${data.results[i]["name"]}','${data.results[i]["country_code"]}')"<span>${data.results[i]["name"]}</span><span>${data.results[i]["country"]}</span><div>`;
            }
        }else{
            document.getElementById('Return_Data').innerHTML+=`<span style="background-color:transparent; text-align:center; display:block;color:#C61951">Unable to find any Country</span>`;
        }
    })
    return false;
}
function Fecth_Using_User_Coordinates(logitude,latitude,city,country)
{
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${logitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,cloud_cover,snowfall&timezone=auto`)
    .then(res=>res.json()).then(data=>{
        
        if(!data.current['rain']&&!data.current['showers']&&!data.current['snowfall']){
            if(data.current['cloud_cover']>50)
            {
                document.getElementById("Weather-Img").setAttribute("src",`./Realted_Media/${data.current['is_day']}/clouds.png`);
            }else{
                document.getElementById("Weather-Img").setAttribute("src",`./Realted_Media/${data.current['is_day']}/clear.png`);
            }
        }else if(data.current['rain']){
            document.getElementById("Weather-Img").setAttribute("src",`./Realted_Media/${data.current['is_day']}/rain.png`);
        }else if(data.current['showers']){
            document.getElementById("Weather-Img").setAttribute("src",`./Realted_Media/${data.current['is_day']}/drizzle.png`);
        }else if(data.current['snowfall']){
            document.getElementById("Weather-Img").setAttribute("src",`./Realted_Media/${data.current['is_day']}/snow.png`);
        }
        
        if(!data.current['is_day']){
            document.querySelector('.Main-Section .Content-Wrapper').setAttribute("style","background-image:url('./Realted_Media/stars.png')");
        }else{
            document.querySelector('.Main-Section .Content-Wrapper').setAttribute("style","background-image:')");
        }
        let time=data.current["time"].split("T")[1].split(":")[0];
        document.querySelector('section.Main-Section').setAttribute("class",`Main-Section g${time}`);
        



        for (const key in data.current) {
            console.log(key+" : "+data.current[key]+ data.current_units[key])
            let s=document.getElementById(key);
            if(s)
            {
                s.innerHTML=data.current[key]+data.current_units[key];
            }
        }
        document.getElementById('City-Country').innerHTML=city+" - "+country;
        document.getElementById('Return_Data').innerHTML='';
    });
}