import React, { useEffect, useState } from 'react';
import { Picker, StyleSheet, Switch, View, Slider } from 'react-native';
import { ColorPicker, fromHsv, toHsv } from 'react-native-color-picker';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { Text } from '../components/Themed';



export default function TabOneScreen() {
  
  const nomelampada = 'rgb';
  const [isEnabled, setIsEnabled] = useState(false);
  const [funcaoAtiva, setFuncaoAtiva] = useState("");
  const [rgbcolor, setRgbColor] = useState("#00ffe7");
  const [oldColor, setOldColor] = useState('#00ffe7');
  const [vcolor, setColor] = useState(toHsv('#00ffe7'));
  const [intervalo, setIntervalo] = useState('20');
  const [atualizarTela, setAtualizarTela] = useState(true);

  useEffect(() => {
    //console.error(`Estado da variavel atualizar tela: ${atualizarTela}`);

    if (atualizarTela) {
      getStatusAtual();
      setAtualizarTela(false);
    }
  }); 


  
  const getStatusAtual = async () => {
    try {
      let res = await fetch(`http://api.mesttech.com.br/iot/?name=${nomelampada}&function=status`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      res = await res.json();
      console.log(res['funcao']);
      setIsEnabled(Boolean(Number(res['status'])));
      setFuncaoAtiva(res['funcao']);
      setOldColor(res['cor']);
      setIntervalo(res['tempo']);
    } catch (e) {
      console.error(e);
    }
  }

  const changeColor = (value: any) => {
    setRgbColor(fromHsv(value).substr(1, 6));
    setColor(value);
    return value;
  }

  const onPressOnOff = async (value: any) => {
    try {
      setIsEnabled(previousState => !previousState);
      let res = await fetch(`http://api.mesttech.com.br/iot/?name=${nomelampada}&turn_on_off=${!value ? 1 : 0}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      res = await res.json();
      console.log(res)
    } catch (e) {
      console.error(e);
    }
  }

  const chamafuncoes = (value: any) => {
    changeFunction(value);
    setFuncaoAtiva(value);
  }

  const changeFunction = async (value: any) => {

    try {
      let res = await fetch(`http://api.mesttech.com.br/iot/?name=${nomelampada}&function=${value}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      res = await res.json();
      console.log(res)
    } catch (e) {
      console.error(e);
    }
  }

  const saveColor = async () => {
    try {
      setOldColor(`#${rgbcolor}`);
      let res = await fetch(`http://api.mesttech.com.br/iot/?name=${nomelampada}&color=${rgbcolor}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      res = await res.json();
      console.log(rgbcolor);
      console.log(res)
    } catch (e) {
      console.error(e);
    }
  }

  const salvaIntervalo = async () => {
    try {
      let res = await fetch(`http://api.mesttech.com.br/iot/?name=${nomelampada}&duration=${intervalo}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      res = await res.json();
      console.log(rgbcolor);
      console.log(res)
    } catch (e) {
      console.error(e);
    }
  }

  const alteraIntervalo = (value: any) => {
    setIntervalo(parseInt(value, 10));
  }



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text adjustsFontSizeToFit={true} style={styles.title}>Lampada conectada: {nomelampada.toUpperCase()}</Text>
      </View>
      <ScrollView>
        <View style={styles.main}>
          <View style={styles.powerContainer}>
            <View style={{ alignContent: 'space-between', display: 'flex', flexDirection: 'row' }}>
              <Text style={styles.h2}>Liga e desliga: </Text>
              <Switch
                onValueChange={() => onPressOnOff(isEnabled)}
                style={styles.onOff}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                value={isEnabled}
              />
            </View>

            <View style={{ minWidth: 30,  alignContent: 'flex-end', marginStart: 'auto'}}>
              <TouchableOpacity
                style={{
                  borderRadius: 10, backgroundColor: "#7DCAC2", alignItems: "center", paddingTop: 1, padding: 5
                }}
                onPress={() => {getStatusAtual()}}>
                <Text style={{ color: "black" }}>↺</Text>
              </TouchableOpacity>
            </View>

          </View>
          <View style={styles.colorContainer}>
            <Text style={styles.h2}>Selecione a cor:</Text>
            <ColorPicker
              oldColor={oldColor}
              color={vcolor}
              style={styles.colorPicker}
              onColorChange={(vcolor) => changeColor(vcolor)}
              onColorSelected={color => alert(`Cor selecionada: ${color}`)}
              onOldColorSelected={color => alert(`Cor aplicada: ${oldColor}`)}
            />
            <TouchableOpacity
              style={{
                borderRadius: 20, backgroundColor: "#7DCAC2", padding: 10, alignItems: "center", marginBottom: 10, width: 150, justifyContent: "center",
              }}
              onPress={() => saveColor()}>
              <Text style={{ color: "black" }}>Salvar cor</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.functionContainer}>

            <Text style={styles.h2}>Função:</Text>

            <Picker
              selectedValue={funcaoAtiva}
              style={{ height: 20, width: 150, backgroundColor: 'blue', }}
              onValueChange={(itemValue) => chamafuncoes(itemValue,)}
            >
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Cor fixa" value="static" />
              <Picker.Item label="Carrossel" value="carrossel" />
              <Picker.Item label="Pisca - Pisca" value="blink" />
              <Picker.Item label="Pulsante" value="fade" />
            </Picker>
            {['carrossel', 'blink', 'fade'].includes(funcaoAtiva) && (
              <View style={{alignItems: 'center'}}>
                <Slider
                  value={parseInt(intervalo, 10)}
                  step={5}
                  style={{ height: 40 , width: '100%'}}
                  minimumValue={20}
                  maximumValue={200}
                  onValueChange={value => { alteraIntervalo(value) }}
                  onTouchEnd={() => { salvaIntervalo() }}
                  minimumTrackTintColor="#0b7200"
                  maximumTrackTintColor="#000000"
                />
                <Text style={{ fontStyle: 'italic', marginTop: 10, fontSize: 10 }}>
                  Intervalo: {intervalo}ms
                </Text>
              </View>
            )}

          </View>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#7DCAC2',
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: 15,
    paddingRight: 15,
  },
  header: {
    marginTop: 30,
    padding: 10,
    display: 'flex',
    justifyContent: 'center'
  },
  title: {
    textAlignVertical: "center",
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },
  main: {
    display: 'flex',
    flex: 0.1,
    marginBottom: 50,
  },
  powerContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    padding: 15,
    backgroundColor: "lightblue",
  },
  colorContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    padding: 5,
    backgroundColor: "lightblue",
    display: "flex",
    borderRadius: 20,
  },
  functionContainer: {
    borderRadius: 20,
    backgroundColor: "lightblue",
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
  },
  h1: {
    fontSize: 20,
    fontWeight: '700'
  },
  onOff: {
    width: 'auto',
    height: 25
  },
  h2: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  colorPicker: {
    width: "100%",
    display: 'flex',
    height: 200,
  }
});
