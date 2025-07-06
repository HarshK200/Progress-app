package main

// Kanban user DataTypes
type Board struct {
	Id      string   `json:"id"`
	Name    string   `json:"name"`
	ListIds []string `json:"list_ids"`
}

type List struct {
	Id        string   `json:"id"`
	Title     string   `json:"title"`
	ClassName string   `json:"classname"`
	BoardId   string   `json:"board_id"`
	CardIds   []string `json:"card_ids"`
}

type ListCard struct {
	Id         string  `json:"id"`
	Title      string  `json:"title"`
	IsDone     bool    `json:"is_done"`
	BoardId    string  `json:"board_id"`
	ListId     string  `json:"list_id"`
	PrevCardId *string `json:"prev_card_id"`
	NextCardId *string `json:"next_card_id"`
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
