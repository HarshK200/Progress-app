package main

import (
	"encoding/json"
	"os"
)

const LOCAL_FILEDATA_PATH = "./"

// Writes the given struct to json file with the given filename
func WriteJson(filename string, data any) error {
	jsonBytes, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	file, err := os.Create(filename + ".json")
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = file.Write(jsonBytes)
	if err != nil {
		return err
	}

	return nil
}

// Reads the json from given filename and writes it to the dest pointer of type T
func ReadJsonFromFile[T any](filename string, dest *T) error {
	jsonByes, err := os.ReadFile(filename)
	if err != nil {
		return err
	}

	err = json.Unmarshal(jsonByes, dest)
	if err != nil {
		return err
	}

	return nil
}
