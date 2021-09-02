import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Picker, StyleSheet, Switch, View, Slider } from "react-native";
import { ColorPicker, fromHsv, toHsv } from "react-native-color-picker";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import { Text } from "../components/Themed";

export default function TabOneScreen() {
  const nomelampada = "rgb";
  const [isEnabled, setIsEnabled] = useState(true);
  const [funcaoAtiva, setFuncaoAtiva] = useState("");
  const [rgbcolor, setRgbColor] = useState("#00ffe7");
  const [oldColor, setOldColor] = useState("#00ffe7");
  const [vcolor, setColor] = useState(toHsv("#00ffe7"));
  const [intervalo, setIntervalo] = useState("20");
  const [atualizarTela, setAtualizarTela] = useState(true);

  useEffect(() => {
    if (atualizarTela) {
      getStatusAtual();
      setAtualizarTela(false);
    }
  }, [isEnabled]);

  const setJsonStatus = async (jsonState) => {
    return await AsyncStorage.setItem("jsonState", JSON.stringify(jsonState));
  };

  const getStatusAtual = async (atualizar = true) => {
    let jsonStatus = JSON.parse(await AsyncStorage.getItem("jsonState"));
    try {
      let res = await fetch(
        `http://mesttech.com.br/api/iot_api/public/api/state/1`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      res = await res.json();
      let temp = { ...jsonStatus };
      temp["state"] = res["state"].toString();

      let jsonState = {
        state: res["state"].toString(),
        parameters: {
          function: res["defined_parameters"]["function"],
          color: res["defined_parameters"]["color"],
          time: res["defined_parameters"]["time"],
          brightness: null,
        },
        more: {
          DeviceName: "RGB",
        },
      };

      setJsonStatus(jsonState);

      if (atualizar) {
        setIsEnabled(Boolean(Number(res["state"])));
        setFuncaoAtiva(res["defined_parameters"]["function"]);
        setOldColor(res["defined_parameters"]["color"]);
        setColor(res["defined_parameters"]["color"]);
        setIntervalo(res["defined_parameters"]["time"]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const changeColor = (value: any) => {
    setRgbColor(fromHsv(value).substr(1, 6));
    setColor(value);
    return value;
  };

  const onPressOnOff = async () => {
    let jsonStatus = JSON.parse(await AsyncStorage.getItem("jsonState"));
    try {
      let temp = { ...jsonStatus };
      temp["state"] = Number(!!!isEnabled).toString();
      await setJsonStatus(temp);
      let res = await fetch(
        `http://mesttech.com.br/api/iot_api/public/api/state/1`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(temp),
        }
      );
      res = await res.json();
      setIsEnabled(Boolean(Number(!!!isEnabled)));
    } catch (e) {
      console.error(e);
    }
  };

  const chamafuncoes = (value: any) => {
    changeFunction(value);
    setFuncaoAtiva(value);
  };

  const changeFunction = async (value: any) => {
    let jsonStatus = JSON.parse(await AsyncStorage.getItem("jsonState"));
    let tempValue = value;
    try {
      let temp = { ...jsonStatus };
      temp["state"] = "1";
      temp["parameters"]["function"] = tempValue;
      setJsonStatus(temp);
      let res = await fetch(
        `http://mesttech.com.br/api/iot_api/public/api/state/1`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(temp),
        }
      );
      res = await res.json();
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  };

  const saveColor = async () => {
    let tempRgbcolor = rgbcolor;
    let jsonStatus = JSON.parse(await AsyncStorage.getItem("jsonState"));
    try {
      setOldColor(`#${rgbcolor}`);
      let temp = { ...jsonStatus };
      temp["state"] = "1";
      temp["parameters"]["color"] = `#${tempRgbcolor}`;
      setJsonStatus(temp);

      console.log(temp);
      let res = await fetch(
        `http://mesttech.com.br/api/iot_api/public/api/state/1`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(temp),
        }
      );
      res = await res.json();
      console.log(rgbcolor);
      console.log(res);
      //setRgbColor(tempRgbcolor);
    } catch (e) {
      console.error(e);
    }
  };

  const salvaIntervalo = async () => {
    let jsonStatus = JSON.parse(await AsyncStorage.getItem("jsonState"));
    let tempintervalo = intervalo;
    await getStatusAtual();
    try {
      let temp = { ...jsonStatus };
      temp["state"] = "1";
      temp["parameters"]["time"] = tempintervalo;
      setJsonStatus(temp);
      let res = await fetch(
        `http://mesttech.com.br/api/iot_api/public/api/state/1`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(temp),
        }
      );
      res = await res.json();
      console.log(rgbcolor);
      console.log(res);
      setIntervalo(tempintervalo);
    } catch (e) {
      console.error(e);
    }
  };

  const alteraIntervalo = (value: any) => {
    setIntervalo(parseInt(value, 10));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text adjustsFontSizeToFit={true} style={styles.title}>
          Lampada conectada: {nomelampada.toUpperCase()}
        </Text>
      </View>
      <ScrollView>
        <View style={styles.main}>
          <View style={styles.powerContainer}>
            <View
              style={{
                alignContent: "space-between",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Text style={styles.h2}>Liga e desliga: </Text>
              <Switch
                onValueChange={() => onPressOnOff()}
                style={styles.onOff}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#E8C547" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                value={isEnabled}
              />
            </View>
            <View
              style={{
                minWidth: 30,
                alignContent: "flex-end",
                marginStart: "auto",
              }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 10,
                  backgroundColor: "#E8C547",
                  alignItems: "center",
                  paddingTop: 1,
                  padding: 5,
                }}
                onPress={() => {
                  getStatusAtual();
                }}
              >
                <Text style={{ color: "black" }}>↺</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.colorContainer}>
            <View style={{ width: "100%", padding: 10}}>
              <Text style={styles.h2}>Selecione a cor:</Text>
            </View>
            <ColorPicker
              oldColor={oldColor}
              color={vcolor}
              style={styles.colorPicker}
              onColorChange={(vcolor) => changeColor(vcolor)}
              onColorSelected={(color) => alert(`Cor selecionada: ${color}`)}
              onOldColorSelected={(color) => alert(`Cor aplicada: ${oldColor}`)}
            />
            <TouchableOpacity
              style={{
                borderRadius: 20,
                backgroundColor: "#3d3d41",
                padding: 10,
                alignItems: "center",
                marginVertical: 15,
                width: 150,
                justifyContent: "center",
              }}
              onPress={() => saveColor()}
            >
              <Text
                style={{
                  color: "#e6e6e6",
                }}
              >
                Salvar cor
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.functionContainer}>
            <Text style={styles.h2}>Função:</Text>
            <View
              style={{
                backgroundColor: "#66666c",
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 5,
                marginVertical: 10,
              }}
            >
              <Picker
                selectedValue={funcaoAtiva}
                style={{
                  height: 20,
                  width: 150,
                  color: "#e6e6e6",
                  minWidth: "100%",
                }}
                onValueChange={(itemValue) => chamafuncoes(itemValue)}
              >
                <Picker.Item label="Selecione" value="" />
                <Picker.Item label="Cor fixa" value="static" />
                <Picker.Item label="Carrossel" value="carrossel" />
                <Picker.Item label="Pisca - Pisca" value="blink" />
                <Picker.Item label="Pulsante" value="fade" />
              </Picker>
            </View>
            {["carrossel", "blink", "fade"].includes(funcaoAtiva) && (
              <View style={{ alignItems: "center" }}>
                <Slider
                  value={parseInt(intervalo, 10)}
                  step={5}
                  style={{ height: 40, width: "100%" }}
                  minimumValue={20}
                  maximumValue={200}
                  onValueChange={(value) => {
                    alteraIntervalo(value);
                  }}
                  onTouchEnd={() => {
                    salvaIntervalo();
                  }}
                  minimumTrackTintColor="#a28931"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#ffc802"
                />
                <Text
                  style={{
                    color: "#e6e6e6",
                    fontStyle: "italic",
                    marginTop: 10,
                    fontSize: 10,
                  }}
                >
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
    backgroundColor: "#2d2d2f",
    flex: 1,
    justifyContent: "flex-start",
    paddingLeft: 15,
    paddingRight: 15,
  },
  header: {
    marginTop: 30,
    padding: 10,
    display: "flex",
    justifyContent: "center",
  },
  title: {
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: "#e6e6e6",
  },
  main: {
    display: "flex",
    flex: 0.1,
    marginBottom: 50,
  },
  powerContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    padding: 15,
    backgroundColor: "#525258",
  },
  colorContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    padding: 5,
    backgroundColor: "#525258",
    display: "flex",
    borderRadius: 20,
  },
  functionContainer: {
    borderRadius: 20,
    backgroundColor: "#525258",
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
  },
  h1: {
    color: "#e6e6e6",
    fontSize: 20,
    fontWeight: "700",
  },
  onOff: {
    width: "auto",
    height: 25,
  },
  h2: {
    color: "#e6e6e6",
    fontSize: 15,
    fontWeight: "bold",
  },
  colorPicker: {
    width: "100%",
    display: "flex",
    height: 200,
  },
});
