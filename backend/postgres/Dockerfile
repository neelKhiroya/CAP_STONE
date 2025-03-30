FROM alpine:latest

WORKDIR /root/

COPY backend_server .
COPY .env .

EXPOSE 7210

CMD [ "./backend_server" ]