FROM golang:latest

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . ./

RUN go build -o websocket_server .

EXPOSE 7220

CMD [ "./websocket_server" ]