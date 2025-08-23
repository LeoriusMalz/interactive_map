// Инициализация карты
// 55.925780, 37.514727
// 55.935356, 37.523696

// NW - 55.934342, 37.514862
// SW - 55.926050, 37.514807
// NE - 55.934337, 37.526694

let rotationAngle = 0; // Текущий угол поворота
// let rotatedImage; // Для хранения rotated overlay

const markerElements = [];                                                                                                  // Массив с маркерами для отображения

function addMarker(coords, name, desc, category) {
    switch (category) {
        case "кофейня": htmlAlt = '<div class="rotating-marker" style="text-shadow: 0 0 10px rgba(0,0,0,0.2);">☕</div>'; break;
        case "столовая": htmlAlt = '<div class="rotating-marker" style="text-shadow: 0 0 10px rgba(0,0,0,0.2);">🍽️</div>'; break;
        case "корпус": htmlAlt = name; break;
        default: htmlAlt = '📌';
    }

    const markerElement = L.marker(coords, {                                                              // Создание маркера для отображения
        icon: L.divIcon({                                                                                                   // Иконка для маркера
            className: `marker-${category}`,
            html: htmlAlt,
            iconSize: [30, 30]
        }),
        zIndexOffset: 100,
        draggable: true
    }).addTo(map);

    markerElement.bindPopup(`<b>${name}</b><br>${desc}<br>Категория: ${category}`);                                      // Всплывающее окно с информацией о маркере
    markerElements.push({                                                                                                   // Добавление маркера в массив
        element: markerElement,
        name: name.toLowerCase(),
        category: category,
        coords: coords
    });
}

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
        rotatedImage.reposition(rotatePoint(northWest[0], northWest[1], initPoint[0], initPoint[1], -15), 
            rotatePoint(northEast[0], northEast[1], initPoint[0], initPoint[1], -15), 
            rotatePoint(southWest[0], southWest[1], initPoint[0], initPoint[1], -15));
        map.setView(initPoint);

        markerElements.forEach(markerElement => {
            marker = markerElement;

            marker.element.setLatLng(marker.coords);
        });

        return;
    }

    let center = map.getCenter();
    newSouthWest = rotatePoint(southWest[0], southWest[1], center.lat, center.lng, angle-15);
    newNorthEast = rotatePoint(northEast[0], northEast[1], center.lat, center.lng, angle-15);
    newNorthWest = rotatePoint(northWest[0], northWest[1], center.lat, center.lng, angle-15);

    rotatedImage.reposition(newNorthWest, newNorthEast, newSouthWest);

    markerElements.forEach(markerElement => {
        marker = markerElement;

        marker.element.setLatLng(rotatePoint(marker.coords[0], marker.coords[1], center.lat, center.lng, angle));
    });

    // userMarker.setLatLng(rotatePoint(userCoords[0], userCoords[1], center.lat, center.lng, angle));

    // Обновляем угол маркеров (пример для userMarker)
    // if (userMarker) {
    //     userMarker.setRotationAngle(angle);
    // }
}

// Инициализация карты


// const southWest = [55.925780, 37.523696]; 
// const northEast = [55.935356, 37.514727];

// var southWest = [55.925780, 37.514727];
// var northEast = [55.935356, 37.523696];
// var northWest = [55.935356, 37.514727];

var southWest = [55.926050, 37.514807];
var northEast = [55.934337, 37.526694];
var northWest = [55.934342, 37.514862];

// var southWest = [55.925630, 37.514807];
// var northEast = [55.934787, 37.526694];
// var northWest = [55.934792, 37.514862];

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
const imageUrl = 'static/data/map 2.png';                                                                                                // Загрузка файла карты
const imageBounds = [southWest, northEast];                                                       // Границы карты
// L.imageOverlay(imageUrl, imageBounds).addTo(map);

// Добавление ПОВОРАЧИВАЕМОГО изображения (замените на ваш URL)
var rotatedImage = L.imageOverlay.rotated(
    imageUrl,
    rotatePoint(northWest[0], northWest[1], initPoint[0], initPoint[1], -15), // Юго-восток
    rotatePoint(northEast[0], northEast[1], initPoint[0], initPoint[1], -15),
    rotatePoint(southWest[0], southWest[1], initPoint[0], initPoint[1], -15)
).addTo(map);

// var rotatedImage2 = L.imageOverlay.rotated(
//     'map.jpg',
//     northWest, // Юго-восток
//     northEast,
//     southWest,
//     {opacity: 0.5}
// ).addTo(map);

// ------------------------------------------| КОМПАС |--------------------------------------------

// const compass = document.getElementById('compass-ring');
// const compassDegrees = document.getElementById('compass-degrees');
// let isDragging = false;
// let startAngle = 0;
// let currentRotation = 0;

// // Начальные координаты центра компаса
// const compassRect = compass.getBoundingClientRect();
// const centerX = compassRect.left + compassRect.width / 2;
// const centerY = compassRect.top + compassRect.height / 2;
// startAngle = 0;

// // Обработчики событий
// compass.addEventListener('mousedown', (e) => {
//     isDragging = true;
//     // console.log(Math.atan2(
//     //     e.clientY - centerY,
//     //     e.clientX - centerX
//     // ) * 180 / Math.PI);
//     // startAngle = angle + Math.atan2(
//     //     e.clientY - centerY,
//     //     e.clientX - centerX
//     // ) * 180 / Math.PI;
//     compass.style.cursor = 'grabbing';
// });

// compassDegrees.addEventListener('mousedown', (e) => {
//     updateCompass(0);
// });

// document.addEventListener('mousemove', (e) => {
//     if (!isDragging) return;
    
//     const angle = Math.atan2(
//         e.clientY - centerY,
//         e.clientX - centerX
//     ) * 180 / Math.PI;
    
//     currentRotation = angle - startAngle + 90;
//     updateCompass(currentRotation);
// });

// document.addEventListener('mouseup', () => {
//     isDragging = false;
//     compass.style.cursor = 'grab';
// });

// // Обновление компаса и карты
// function updateCompass(degrees) {
//     // Нормализуем угол (0-360)
//     degrees = (degrees % 360 + 360) % 360;
    
//     // Вращаем кольцо
//     compass.style.transform = `rotate(${(degrees)%360}deg)`;
//     compassDegrees.textContent = `${(Math.round(degrees))%360}°`;
    
//     // Поворачиваем карту (используем вашу функцию rotateMap)
//     rotateMap(degrees);
// };

// ------------------------------------------| КОНЕЦ КОМПАСА |--------------------------------------------


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


// Инициализация карты
// let imageOverlay;

// Функция обновления границ
// function updateMapBounds() {
//     const south = parseFloat(document.getElementById('south-slider').value);
//     const north = parseFloat(document.getElementById('north-slider').value);
//     const west = parseFloat(document.getElementById('west-slider').value);
//     const east = parseFloat(document.getElementById('east-slider').value);
    
//     newBounds = [
//         rotatePoint(north, west, initPoint[0], initPoint[1], 15),
//         rotatePoint(north, east, initPoint[0], initPoint[1], 15),
//         rotatePoint(south, west, initPoint[0], initPoint[1], 15)
//     ];
    
//     // Обновляем или создаем imageOverlay
//     if (imageOverlay) {
//         imageOverlay.reposition(newBounds[0], newBounds[1], newBounds[2]);
//         // imageOverlay.setBounds([newBounds[2], newBounds[1]]);
//     } else {
//         imageOverlay = L.imageOverlay.rotated(
//             'static/data/map 2.png',
//             newBounds[0], // Юго-восток
//             newBounds[1],
//             newBounds[2]
//         ).addTo(map);
//         // imageOverlay = L.imageOverlay('static/data/map 2.png', newBounds).addTo(map);
//     }
    
//     // Обновляем отображаемые значения
//     document.getElementById('south-value').textContent = newBounds[2][0].toFixed(6);
//     document.getElementById('north-value').textContent = newBounds[1][0].toFixed(6);
//     document.getElementById('west-value').textContent = newBounds[2][1].toFixed(6);
//     document.getElementById('east-value').textContent = newBounds[1][1].toFixed(6);
// }

// Назначаем обработчики для всех ползунков
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
    { coords: [55.928981, 37.521500], name: "Столовая", desc: "КПМ, 2 этаж", category: "столовая" },
    { coords: [55.929043, 37.518316], name: "Кафе «Теория»", desc: "Цифра, -1 этаж", category: "столовая" },
    { coords: [55.929001, 37.517782], name: "Кофейня", desc: "Цифра, 2 этаж", category: "кофейня" },
    { coords: [55.929508, 37.519114], name: "Буфет", desc: "ГК, 2 этаж", category: "столовая" },
    { coords: [55.929253, 37.517461], name: "Кофейня Даблби", desc: "ГК, 2 этаж", category: "кофейня" },

    { coords: [55.929419, 37.518245], name: "ГК", desc: "Главный корпус", category: "корпус" },
    { coords: [55.929102, 37.518539], name: "УЛК-1", desc: "Физтех.Цифра", category: "корпус" },
    { coords: [55.928326, 37.518115], name: "УЛК-2", desc: "Физтех.Арктика", category: "корпус" },
    { coords: [55.930185, 37.518224], name: "ЛК", desc: "Лабораторный корпус", category: "корпус" },
    { coords: [55.929870, 37.516212], name: "РТК", desc: "Радиотехнический корпус", category: "корпус" },
    { coords: [55.929707, 37.515773], name: "БФК", desc: "Физтех.Био / Биофармацевтический корпус", category: "корпус" },
    { coords: [55.929183, 37.520619], name: "НК", desc: "Физтех.Квант / Новый корпус / Корпус микроэлектроники", category: "корпус" },
    { coords: [55.928670, 37.521619], name: "КПМ", desc: "Корпус прикладной математики", category: "корпус" },
    { coords: [55.927416, 37.518266], name: "ВУЦ", desc: "Военно-учебный центр", category: "корпус" },

    // { lat: 55.929299, lng: 37.517427, name: "Центральный парк", category: "park" }
];

// Добавление маркеров на карту
markers.forEach(marker => {                                                                                                 // Проход по всем маркерам
    addMarker(marker.coords, marker.name, marker.desc, marker.category);
});

document.getElementById('editing-button').addEventListener('click', () => {
    const editingMenu = document.getElementById('edit-menu');

    switch (editingMenu.style.display) {
        case "none":
            editingMenu.style.display = "inline";
            markerElements.forEach(markerElement => {
                marker = markerElement.element;
                marker.dragging.enable();
            });
            break;
        default: 
            editingMenu.style.display = "none";
            markerElements.forEach(markerElement => {
                marker = markerElement.element;
                marker.dragging.disable();
            });
    }
});

const tbody = document.querySelector('#markers-table tbody');
tbody.innerHTML = '';
let ID = 0

document.getElementById('pin-create').addEventListener('click', () => {
    const pinName = document.getElementById('pin-name').value;
    const pinDesc = document.getElementById('pin-desc').value;
    const pinCategory = document.getElementById('pin-category').value;
    const coords = map.getCenter();

    addMarker(coords, pinName, pinDesc, pinCategory);
    ID += 1;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${ID}</td>
        <td>${pinName}</td>
        <td>${pinDesc}</td>
        <td>${pinCategory}</td>
    `;

    tbody.appendChild(row);
});

document.getElementById('sidebar-button').addEventListener('mousedown', () => {
    const sidebar = document.getElementById('sidebar');

    switch (sidebar.style.display) {
        case "inline": 
            sidebar.style.display = "none"; 
            document.getElementById('sidebar-button').textContent = ">";
            break;
        default: 
            sidebar.style.display = "inline";
            document.getElementById('sidebar-button').textContent = "<";
    }
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
userCoords = [0, 0];

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

                userCoords = [lat, lng];
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