package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	app := &App{}

	return app
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// HACK: just for testing
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Meow %s, It's show time!", name)
}

// GetUserData() reads user-data.json from the file-system and returns the user-data
func (a *App) GetUserData() GetUserDataResponse {
	userData := &UserData{}
	err := ReadJsonFromFile("test-user-data", userData)
	if err != nil {
		log.Printf("Error in GetUserData():\n%+v\n", err)

		if errors.Is(err, io.EOF) {
			return GetUserDataResponse{
				Status:     "User data file not found",
				StatusCode: http.StatusNotFound,
				Data:       UserData{},
			}
		}

		return GetUserDataResponse{
			Status:     "error getting user data",
			StatusCode: http.StatusInternalServerError,
			Data:       UserData{},
		}
	}

	return GetUserDataResponse{
		Status:     "Ok",
		StatusCode: http.StatusOK,
		Data:       *userData,
	}
}

// WriteUserData() writes the provided data to user-data.json and
// returns HTTP status codes in result
func (a *App) WriteUserData(req WriteUserDataRequest) WriteUserDataResponse {
	err := WriteJSON("test-user-data", req.Data)
	if err != nil {
		return WriteUserDataResponse{
			Status:     "Unable to write file",
			StatusCode: 500,
		}
	}

	return WriteUserDataResponse{
		Status:     "Data written to user-data.json successfully",
		StatusCode: 200,
	}
}
