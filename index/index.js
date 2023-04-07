const weatherApiKey = '0861252ccfbf4cf781d73401230304';
const uri = 'https://api.weatherapi.com/v1/current.json?key=' + weatherApiKey;
const weatherForm = document.querySelector('form');
const searchEl = document.querySelector('input');
const loadingEL = document.querySelector('.loading');
const weatherDiv = document.querySelector('.weather-info');
let weatherInfo = {};

weatherForm.addEventListener('submit', function(e)
{
  hideWeather();
  getWeatherData(searchEl.value)
  .then(data => {
    displayWeather();
    weatherInfo = data;
    setWeatherInfo();
  })
});

async function getWeatherData(location)
{
  try
  {
    const locationData = await fetchData(location);
    const parsedData =
    {
      condition: locationData.current.condition.text,
      icon: locationData.current.condition.icon,
      temp_c: locationData.current.temp_c,
      temp_f: locationData.current.temp_f,
      location: locationData.location.name,
      time: locationData.location.localtime.split(' ')[1]
    };

    return parsedData;
  }
  catch (err)
  {
    console.log(err);
  }
}

function displayWeather()
{
  loadingEL.classList.add('hidden');
  weatherDiv.classList.remove('hidden');
}

function hideWeather()
{
  loadingEL.classList.remove('hidden');
  weatherDiv.classList.add('hidden');
}

async function fetchData(location)
{
  if (!location || location == '')
  {
    throw new Error('No query');
  }
  const response = await fetch(uri + '&q=' + location);
  return await response.json();
}

function setWeatherInfo()
{
  if (!weatherInfo.condition)
  {
    throw new Error('Weather info object empty');
  }

  const childNodes = getChildNodes(weatherDiv);
  
  childNodes.img.src = weatherInfo.icon;
  childNodes.condition.textContent = weatherInfo.condition;
  childNodes.location.textContent = weatherInfo.location;
  childNodes.temp.textContent = weatherInfo.temp_f;
  childNodes.time.textContent = weatherInfo.time;
}

function getChildNodes(node)
{
  const children = Array.from(node.children);
  return children.reduce((obj, child) => {
    if (!child.className == '')
    {
      obj[child.classList[0]] = child;
    }
    else
    {
      obj[child.localName] = child
    }

    return obj;
  }, {});
}