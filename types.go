package main

// Kanban user DataTypes
type Board struct {
	id      string
	name    string
	ListIds []string
}

type List struct {
	id        string
	title     string
	className string
	BoardId   string
	CardIds   []string
}

type ListCard struct {
	id      string
	title   string
	isDone  bool
	BoardId string
	ListId  string
}

type UserData struct {
	Boards    map[string]Board    `json:"boards"`
	Lists     map[string]List     `json:"lists"`
	ListCards map[string]ListCard `json:"list_cards"`
}

// ============= Backend to frontend communication Datatypes =============
type GetUserDataResponse struct {
	Status     string   `json:"status"`
	StatusCode int      `json:"status_code"`
	Data       UserData `json:"user_data"`
}
