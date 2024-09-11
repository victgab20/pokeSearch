import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as SQLite from 'expo-sqlite';

interface PokemonData {
  name: string;
  base_experience: number;
  height: number;
  abilities: Array<{ ability: { name: string } }>;
  sprites: {
    front_default: string;
  };
}





async function openDatabase(data: PokemonData) {
  const db = await SQLite.openDatabaseAsync('database');
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS pokemonFav (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      nome VARCHAR(255),
      base_experience VARCHAR(255),
      height VARCHAR(255),
      sprite VARCHAR(255)
    );
  `);

  // Insere o Pokémon favorito na tabela
  await db.runAsync(`
    INSERT OR IGNORE INTO pokemonFav (nome, base_experience, height, sprite) 
    VALUES (?, ?, ?, ?);
  `, [data.name, data.base_experience.toString(), data.height.toString(), data.sprites.front_default]);

  // Obtém todos os registros da tabela
  const allRows = await db.getAllAsync('SELECT * FROM pokemonFav');

  return allRows;
}

export default function Search() {
  const [pokemonName, setPokemonName] = useState<string>('');
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [error, setError] = useState<string>('');
  const [favorites, setFavorites] = useState<PokemonData[]>([]); // Estado para armazenar favoritos

  const fetchPokemonData = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      setPokemonData(response.data);
      setError('');
    } catch (err) {
      setError('Pokémon não encontrado. Verifique o nome e tente novamente.');
      setPokemonData(null);
    }
  };

  async function addToFavorites(data: PokemonData) {
     openDatabase(data)
     console.log('salvo')
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Buscador de Pokémon</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do Pokémon"
        value={pokemonName}
        onChangeText={setPokemonName}
      />
      <Button title="Buscar" onPress={fetchPokemonData} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {pokemonData && (
        <View style={styles.pokemonContainer}>
          <Text style={styles.pokemonName}>{pokemonData.name.toUpperCase()}</Text>
          <Image source={{ uri: pokemonData.sprites.front_default }} style={styles.pokemonImage} />
          <Text>Base Experience: {pokemonData.base_experience}</Text>
          <Text>Height: {pokemonData.height}</Text>
          <Text>Abilities:</Text>
          {pokemonData.abilities.map((ability, index) => (
            <Text key={index}>{ability.ability.name}</Text>
          ))}
          <TouchableOpacity onPress={() => addToFavorites(pokemonData)} style={styles.favoriteButton}>
            <Text style={styles.favoriteButtonText}>Adicionar aos Favoritos</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

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
