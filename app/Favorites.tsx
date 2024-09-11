import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

interface PokemonData {
  nome: string;
  base_experience: string;
  height: string;
  sprite: string
}

async function openDatabase(){
  console.log('skd')
  const db = await SQLite.openDatabaseAsync('database');
  const allRows = await db.getAllAsync('SELECT * FROM pokemonFav');
  console.log('2')
  console.log(allRows)
  return allRows.map((row: PokemonData) => ({
    nome: row.nome,
    base_experience: row.base_experience,
    height: row.height,
    sprite: row.sprite

  }));
}


export default function Favorites() {
  const route = useRoute();
  const [favorites, setFavorites] = useState<PokemonData[]>([]);
  const loadFavorites = async () => {
    console.log('Carregando favoritos...');
    const pokemonData = await openDatabase(); // Função que acessa o banco de dados
    setFavorites(pokemonData);
  };
  useEffect(() => {
    loadFavorites();
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pokémons Favoritos</Text>
      {favorites.length === 0 ? (
        <Text style={styles.error}>Nenhum favorito adicionado ainda.</Text>
      ) : (
        favorites.map((pokemon, index) => (
          <View key={index} style={styles.pokemonContainer}>
            <Text style={styles.pokemonName}>{pokemon.nome.toUpperCase()}</Text>
            <Image source={{ uri: pokemon.sprite }} style={styles.pokemonImage} />
            <Text>Base Experience: {pokemon.base_experience}</Text>
            <Text>Height: {pokemon.height}</Text>
          </View>
        ))
      )}
      <Button title="Recarregar Favoritos" onPress={loadFavorites} />
    </ScrollView>
  );
}

// Estilos
const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#f0f0f0',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
    },
    input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
      width: '100%',
      backgroundColor: '#fff',
    },
    error: {
      color: '#ff3333',
      marginVertical: 10,
    },
    pokemonContainer: {
      alignItems: 'center',
      marginVertical: 20,
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      width: '100%',
    },
    pokemonName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    }, 
    pokemonImage: {
      width: 100,
      height: 100,
      marginBottom: 10,
    },
    favoriteButton: {
      marginTop: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#007bff',
      borderRadius: 5,
    },
    favoriteButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
  
