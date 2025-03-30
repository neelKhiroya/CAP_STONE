FROM golang:latest

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . ./

RUN go build -o backend_server .

EXPOSE 7210

CMD [ "./backend_server" ]