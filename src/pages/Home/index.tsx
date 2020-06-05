import React, { useState, useEffect } from "react";
import { ImageBackground, View, Text, Image, StyleSheet,Picker } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Entypo as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

// import { Container } from './styles';

interface IbgeUfResponse {
  sigla: string;
}
interface IbgeCityResponse {
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [uf, setUf] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate("Points",{
      uf, 
      city
    });
  }

  // pega ufs
  useEffect(() => {
    axios
      .get<IbgeUfResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
      )
      .then((response) => {
        const initials = response.data.map((uf) => uf.sigla);
        setUfs(initials);
      });
  }, []);

  // pega cidades
  useEffect(() => {
    if (uf === "") {
      setCity("")
      return;
    };

    axios
      .get<IbgeCityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);
        setCities(cityNames);
      });
  }, [uf]);


  function handleSelectUf(){}
  function handleSelectCity(){}


  return (
    <ImageBackground
      source={require("../../assets/home-background.png")}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          judamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </Text>
      </View>

      <View >
        <Picker
          selectedValue={uf}
          style={ styles.input}
          onValueChange={(itemValue, itemIndex) => setUf(itemValue)}
        >
           <Picker.Item  key={'0'}label={'Selecione o Estado'} value={""} />
          {
            ufs.map(item =>(
              <Picker.Item  key={item}label={item} value={item} />

            ))
          }

        </Picker>
        <Picker
          selectedValue={city}
          style={ styles.input}
          onValueChange={(itemValue, itemIndex) => setCity(itemValue)}
        >
           <Picker.Item  key={'0'}label={'Selecione a Cidade'} value={""} />
          {
            cities.map(item =>(
              <Picker.Item  key={item}label={item} value={item} />

            ))
          }

        </Picker>

      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Icon name="login" color="#fff" size={24} />
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    marginBottom: 20,
    paddingHorizontal: 20,
    borderRadius:20,
    fontSize: 16,
  },
  

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

export default Home;
