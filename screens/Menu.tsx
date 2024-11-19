import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import ManterCachorro from './ManterCachorro';
import ListarCachorro from './ListarCachorro';
import ListarRaca from './ListarRaca';
import ManterRaca from './ManterRaca';

const Drawer = createDrawerNavigator();

export default function Menu (){
    return (
        <Drawer.Navigator initialRouteName="Página Inicial">
            <Drawer.Screen name="Página Inicial" component={Home} />
            <Drawer.Screen name="Manter Cachorro" component={ManterCachorro} />
            <Drawer.Screen name="Listar Cachorro" component={ListarCachorro} />
            <Drawer.Screen name="Manter Raça" component={ManterRaca} />
            <Drawer.Screen name="Listar Raça" component={ListarRaca} />
        </Drawer.Navigator>
    )
}
