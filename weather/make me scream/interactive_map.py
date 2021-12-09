# MesoWest API Token: 7c0eab19bffc4221af1eaf73b4b1237e

import folium

map_1 = folium.Map(location=[64.6431, -147.0638], tiles='Stamen Terrain', zoom_start=8)

map_1.save("map1.html")