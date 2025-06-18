package main

import (
	"encoding/json"
	"os"
	"path/filepath"
)

// HACK: testing for now. Later figure out where (probably ~/.local/share/progress-app) to save user data/boards
var LOCAL_FILEDATA_PATH = "./"

func SaveStructAsJSONToFile(val any, fileName string) error {
	jsonData, err := json.MarshalIndent(val, "", "  ")
	if err != nil {
		return err
	}

	fullPath := filepath.Join(LOCAL_FILEDATA_PATH, fileName)
	err = os.WriteFile(fullPath, jsonData, 0644)
	if err != nil {
		return err
	}

	return nil
}
