// Инициализация карты
// 55.925780, 37.514727
// 55.935356, 37.523696

let rotationAngle = 0; // Текущий угол поворота
// let rotatedImage; // Для хранения rotated overlay

function rotatePoint(lat, lng, centerLat, centerLng, angle) {
    const radians = angle * Math.PI / 180;
    const R = 6378137; // Радиус Земли в метрах
    
    // Относительные координаты в метрах
    const dLat = (lat - centerLat) * Math.PI / 180 * R;
    const dLng = (lng - centerLng) * Math.PI / 180 * R * Math.cos(centerLat * Math.PI / 180);
    
    // Поворот
    const newDLat = dLat * Math.cos(radians) - dLng * Math.sin(radians);
    const newDLng = dLat * Math.sin(radians) + dLng * Math.cos(radians);
    
    // Обратное преобразование
    const newLat = centerLat + (newDLat / R) * 180 / Math.PI;
    const newLng = centerLng + (newDLng / (R * Math.cos(centerLat * Math.PI / 180))) * 180 / Math.PI;
    
    return [newLat, newLng];
}

// Функция поворота карты
function rotateMap(angle) {
    rotationAngle = angle;

    if (angle == 0) {
        rotatedImage.reposition(northWest, northEast, southWest);
        map.setView(initPoint);

        markerElements.forEach(markerElement => {
            marker = markerElement;

            marker.element.setLatLng(marker.coords);
        });

        return;
    }

    let center = map.getCenter();
    newSouthWest = rotatePoint(southWest[0], southWest[1], center.lat, center.lng, angle);
    newNorthEast = rotatePoint(northEast[0], northEast[1], center.lat, center.lng, angle);
    newNorthWest = rotatePoint(northWest[0], northWest[1], center.lat, center.lng, angle);

    rotatedImage.reposition(newNorthWest, newNorthEast, newSouthWest);

    markerElements.forEach(markerElement => {
        marker = markerElement;

        marker.element.setLatLng(rotatePoint(marker.coords[0], marker.coords[1], center.lat, center.lng, angle));
    });

    // Обновляем угол маркеров (пример для userMarker)
    // if (userMarker) {
    //     userMarker.setRotationAngle(angle);
    // }
}

// Инициализация карты


// const southWest = [55.925780, 37.523696]; 
// const northEast = [55.935356, 37.514727];

var southWest = [55.925780, 37.514727];
var northEast = [55.935356, 37.523696];
var northWest = [55.935356, 37.514727];
const initPoint = [(Math.max(northEast[0], northWest[0])+southWest[0])/2, (Math.min(southWest[1], northWest[1])+northEast[1])/2];

const nwDiag = Math.sqrt((northWest[0]-initPoint[0])*(northWest[0]-initPoint[0]) + (northWest[1]-initPoint[1])*(northWest[1]-initPoint[1]));
const swDiag = Math.sqrt((southWest[0]-initPoint[0])*(southWest[0]-initPoint[0]) + (southWest[1]-initPoint[1])*(southWest[1]-initPoint[1]));
const neDiag = Math.sqrt((northEast[0]-initPoint[0])*(northEast[0]-initPoint[0]) + (northEast[1]-initPoint[1])*(northEast[1]-initPoint[1]));

const map = L.map('map', 
                    {minZoom: 16, 
                    maxZoom: 19.5
                    // maxBounds: [[55.927713, 37.516206],
                    //             [55.930662, 37.523304]]
                    }
                ).setView(initPoint, 17.2);                                            // Начальный вид

// Загрузка карты
const imageUrl = 'map3.png';                                                                                                // Загрузка файла карты
const imageBounds = [southWest, northEast];                                                       // Границы карты
// L.imageOverlay(imageUrl, imageBounds).addTo(map);

// Добавление ПОВОРАЧИВАЕМОГО изображения (замените на ваш URL)
var rotatedImage = L.imageOverlay.rotated(
    imageUrl,
    northWest, // Юго-восток
    northEast,
    southWest
).addTo(map);

// var rotatedImage2 = L.imageOverlay.rotated(
//     'map.jpg',
//     northWest, // Юго-восток
//     northEast,
//     southWest,
//     {opacity: 0.5}
// ).addTo(map);

const compass = document.getElementById('compass-ring');
const compassDegrees = document.getElementById('compass-degrees');
let isDragging = false;
let startAngle = 0;
let currentRotation = 0;

// Начальные координаты центра компаса
const compassRect = compass.getBoundingClientRect();
const centerX = compassRect.left + compassRect.width / 2;
const centerY = compassRect.top + compassRect.height / 2;
startAngle = 0;

// Обработчики событий
compass.addEventListener('mousedown', (e) => {
    isDragging = true;
    // console.log(Math.atan2(
    //     e.clientY - centerY,
    //     e.clientX - centerX
    // ) * 180 / Math.PI);
    // startAngle = angle + Math.atan2(
    //     e.clientY - centerY,
    //     e.clientX - centerX
    // ) * 180 / Math.PI;
    compass.style.cursor = 'grabbing';
});

compassDegrees.addEventListener('mousedown', (e) => {
    updateCompass(0);
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const angle = Math.atan2(
        e.clientY - centerY,
        e.clientX - centerX
    ) * 180 / Math.PI;
    
    currentRotation = angle - startAngle + 90;
    updateCompass(currentRotation);
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    compass.style.cursor = 'grab';
});

// Обновление компаса и карты
function updateCompass(degrees) {
    // Нормализуем угол (0-360)
    degrees = (degrees % 360 + 360) % 360;
    
    // Вращаем кольцо
    compass.style.transform = `rotate(${degrees}deg)`;
    compassDegrees.textContent = `${Math.round(degrees)}°`;
    
    // Поворачиваем карту (используем вашу функцию rotateMap)
    rotateMap(degrees);
};

// Обработчики кнопок
// document.getElementById('rotate-left').addEventListener('click', () => {
//     rotateMap(-15);
// });

// document.getElementById('rotate-right').addEventListener('click', () => {
//     rotateMap(15);
// });

// document.getElementById('reset-rotation').addEventListener('click', () => {
//     rotateMap(0);
// });


// // Инициализация карты
// let imageOverlay;

// // Функция обновления границ
// function updateMapBounds() {
//     const south = parseFloat(document.getElementById('south-slider').value);
//     const north = parseFloat(document.getElementById('north-slider').value);
//     const west = parseFloat(document.getElementById('west-slider').value);
//     const east = parseFloat(document.getElementById('east-slider').value);
    
//     const newBounds = [
//         [south, west], // Юго-запад
//         [north, east]  // Северо-восток
//     ];
    
//     // Обновляем или создаем imageOverlay
//     if (imageOverlay) {
//         imageOverlay.setBounds(newBounds);
//     } else {
//         imageOverlay = L.imageOverlay('map3.png', newBounds).addTo(map);
//     }
    
//     // Обновляем отображаемые значения
//     document.getElementById('south-value').textContent = south.toFixed(6);
//     document.getElementById('north-value').textContent = north.toFixed(6);
//     document.getElementById('west-value').textContent = west.toFixed(6);
//     document.getElementById('east-value').textContent = east.toFixed(6);
// }

// // Назначаем обработчики для всех ползунков
// document.querySelectorAll('input[type="range"]').forEach(slider => {
//     slider.addEventListener('input', updateMapBounds);
// });

// // Инициализация при загрузке
// updateMapBounds();


map.attributionControl.setPrefix('<a href="http://t.me/leoriusmalz">LeoriusMalz</a> © 2025');                               // Водяной знак


// Маркеры
const markers = [
    { coords: [55.929643, 37.520252], name: "Кофейня", desc: "НК, 2 этаж", category: "кофейня" },
    { coords: [55.929589, 37.520536], name: "Кофейня-буфет", desc: "НК, 2 этаж", category: "столовая" },
    { coords: [55.928997, 37.521459], name: "Столовая", desc: "КПМ, 2 этаж", category: "столовая" },
    { coords: [55.929056, 37.518324], name: "Кафе «Теория»", desc: "Цифра, -1 этаж", category: "столовая" },
    { coords: [55.928994, 37.517796], name: "Кофейня", desc: "Цифра, 2 этаж", category: "кофейня" },
    { coords: [55.929508, 37.519114], name: "Буфет", desc: "ГК, 2 этаж", category: "столовая" },
    { coords: [55.929240, 37.517486], name: "Кофейня Даблби", desc: "ГК, 2 этаж", category: "кофейня" },

    { coords: [55.929419, 37.518245], name: "ГК", desc: "Главный корпус", category: "корпус" },
    { coords: [55.929102, 37.518539], name: "УЛК-1", desc: "Физтех.Цифра", category: "корпус" },
    { coords: [55.928317, 37.517952], name: "УЛК-2", desc: "Физтех.Арктика", category: "корпус" },
    { coords: [55.930170, 37.518238], name: "ЛК", desc: "Лабораторный корпус", category: "корпус" },
    { coords: [55.929848, 37.516214], name: "РТК", desc: "Радиотехнический корпус", category: "корпус" },
    { coords: [55.929707, 37.515773], name: "БФК", desc: "Физтех.Био / Биофармацевтический корпус", category: "корпус" },
    { coords: [55.929204, 37.520668], name: "НК", desc: "Физтех.Квант / Новый корпус / Корпус микроэлектроники", category: "корпус" },
    { coords: [55.928670, 37.521619], name: "КПМ", desc: "Корпус прикладной математики", category: "корпус" },

    // { lat: 55.929299, lng: 37.517427, name: "Центральный парк", category: "park" }
];

// Добавление маркеров на карту
const markerElements = [];                                                                                                  // Массив с маркерами для отображения
markers.forEach(marker => {                                                                                                 // Проход по всем маркерам
    switch (marker.category) {
        case "кофейня": htmlAlt = '<div class="rotating-marker" style="text-shadow: 0 0 10px rgba(0,0,0,0.2);">☕</div>'; break;
        case "столовая": htmlAlt = '<div class="rotating-marker" style="text-shadow: 0 0 10px rgba(0,0,0,0.2);">🍽️</div>'; break;
        case "корпус": htmlAlt = marker.name; break;
        default: htmlAlt = '📌';
    }

    const markerElement = L.marker(marker.coords, {                                                              // Создание маркера для отображения
        icon: L.divIcon({                                                                                                   // Иконка для маркера
            className: `marker-${marker.category}`,
            html: htmlAlt,
            iconSize: [30, 30]
        }),
        zIndexOffset: 100
    }).addTo(map);

    markerElement.bindPopup(`<b>${marker.name}</b><br>${marker.desc}<br>Категория: ${marker.category}`);                                      // Всплывающее окно с информацией о маркере
    markerElements.push({                                                                                                   // Добавление маркера в массив
        element: markerElement,
        name: marker.name.toLowerCase(),
        category: marker.category,
        coords: marker.coords
    });
});

// Поиск по названию
document.getElementById('search').addEventListener('input', (e) => {                                                        // Чтение поля поиска
    const searchTerm = e.target.value.toLowerCase();                                                                        // Выделение запроса из поля поиска и приведение в нижний регистр
    markerElements.forEach(marker => {                                                                                      // Проход по всем маркерам
        const isVisible = marker.name.includes(searchTerm);                                                                 // Проверка на совпадение маркера с запросом
        marker.element.setOpacity(isVisible ? 1 : 0);                                                                       // Невидимость для несовпадающих маркеров
    });
});

// Фильтрация по категориям
document.querySelectorAll('.category-checkbox').forEach(checkbox => {                                                       // Проход по всем чекбоксам категорий
    checkbox.addEventListener('change', () => {                                                                             // Фиксируем изменения чекбокса
        const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked')).map(cb => cb.value); // Список выделенных категорий
        markerElements.forEach(marker => {                                                                                  // Проход по всем маркерам
            const isVisible = selectedCategories.includes(marker.category);                                                 // Проверка маркера на принадлежность категории
            marker.element.setOpacity(isVisible ? 1 : 0);                                                                   // Невидимость для маркеров из невыделенных категорий
        });
    });
});

// Функция расчёта расстояния (формула гаверсинусов)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Радиус Земли в км
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;                                                                                                           // Расстояние в км
}

// Отслеживание геопозиции
let watchId = null; // Для хранения ID отслеживания
const locateBtn = document.getElementById('locate-btn');
userMarker = null;

locateBtn.addEventListener('click', () => {
    if (!watchId) {
        // Включение слежения
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const distance = getDistance(
                    lat,
                    lng,
                    initPoint[0],
                    initPoint[1]
                ).toFixed(2);

                if (distance > 2) {
                    alert("Вы находитесь слишком далеко от кампуса!");
                    navigator.geolocation.clearWatch(watchId);
                    watchId = null;
                    return;
                }

                locateBtn.textContent = "⏹ Остановить слежение";
                // Удаляем старый маркер
                if (userMarker) map.removeLayer(userMarker);

                // Создаём новый маркер
                userMarker = L.circleMarker([lat, lng], {
                    radius: 10,
                    fillColor: "#4285F4",
                    color: "#fff",
                    weight: 2
                }).addTo(map);

                map.setView([lat, lng]);
                updateDistance({ lat, lng });

                userMarker.bindPopup(`Вы здесь!<br>${lat} ${lng}<br>Speed: ${(position.coords.speed || 0).toFixed(1)} km/h`).openPopup();
            },
            (error) => {
                console.error("Ошибка геолокации:", error);
            },
            { 
                enableHighAccuracy: true, // Высокая точность (GPS)
                maximumAge: 0, // Не использовать кеш
                timeout: 5000 // Макс. время ожидания
            }
        );
        if (watchId) {
            locateBtn.textContent = "📍 Найти меня";
        }
    } else {
        // Выключение слежения
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        locateBtn.textContent = "📍 Найти меня";
    }
});