var button = document.querySelector('.button')
var inputValue = document.querySelector('.inputValue')
var tables = document.querySelector('.tables')


button.addEventListener('click', function(){
  var ele = document.getElementsByName('city');
              
  for(i = 0; i < ele.length; i++) {
      if(ele[i].checked)
      var checkedValue = ele[i].value;
  }
  if (checkedValue == "Other"){
    tables.innerHTML = ""; /*Clears the div tags for tables for the new table.*/
    enterAndPrintValues(inputValue.value);
  }else if(checkedValue == "All_of_the_above"){
    tables.innerHTML = ""; /*Clears the div tags for tables for the new table.*/
    for(i = 0; i < ele.length-2; i++) {
      enterAndPrintValues(ele[i].value);
    }
  }else{
    tables.innerHTML = ""; /*Clears the div tags for tables for the new table.*/
    enterAndPrintValues(checkedValue);
  }
})


function enterAndPrintValues(selectedValueParameter){
  fetch('https://api.openweathermap.org/data/2.5/weather?q='+selectedValueParameter+'&appid=24649fff73c6f2040d81bbca7fd9b993')
  .then(response => response.json())
  .then(data => {
    var nameValue = data['name'];
    var descValue = data['weather'][0]['description'];
    var tempValue = data['main']['temp'];
    var feelsLikeValue = data['main']['feels_like'];
    var humidityValue = data['main']['humidity'];
    var visibilityValue = data['visibility'];
    $.ajax({
      type: "GET",
      url: "table.json",
      success:function(response)
      {
        /*Lines below are for creating the table as well as inserting the values*/
        $(".tables").append(response.opentag);
        $(".tables").append(response.name_opentag+nameValue+response.name_closetag); /*Name of city*/
        $(".tables").append(response.description_opentag+descValue+response.description_closetag); /*Description of weather*/
        $(".tables").append(response.temperature_opentag+Math.round(tempValue-273.15)+'&#8451; / '+Math.round((tempValue-273.15)*9/5+32)+'&#8457;'+response.temperature_closetag); /*Temperature in celsius and farenheit*/
        $(".tables").append(response.feels_like_opentag+Math.round(feelsLikeValue-273.15)+'&#8451; / '+Math.round((feelsLikeValue-273.15)*9/5+32)+'&#8457;'+response.feels_like_closetag); /*Feels like in celsius and farenheit*/
        $(".tables").append(response.humidity_opentag+humidityValue+'%'+response.humidity_closetag); /*Humidity*/
        $(".tables").append(response.visibility_opentag+visibilityValue/1000+"km"+response.visibility_closetag); 
        $(".tables").append(response.closetag);
      }
    });
  })
  .catch(err => alert("Can't find city named: "+selectedValueParameter))
}


