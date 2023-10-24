console.log("Komalpreet");
const API_key = "dba92b871b8469679ec9371db91132d6";
async function showWeather() {
    // let latitude = 15.333;
    // let longitude = 74.0833;
    let city = "Punjab";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
    console.log("Response ");
    const data = await response.json();
    console.log(data);

    //let json = JSON.parse(data);
    let newPara = document.createElement('p');
    newPara.textContent = `${data?.main?.temp.toFixed(2)} c`;
    let newPara2 = document.createElement('p');
    newPara2.textContent = data["main"].temp;
    document.body.appendChild(newPara);
    document.body.appendChild(newPara2);

}
showWeather();