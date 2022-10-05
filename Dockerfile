FROM golang:alpine as builder

WORKDIR /app

RUN go mod init module
RUN go mod download && go mod verify 

COPY . .

RUN go build -v -o main .

FROM scratch

WORKDIR /app

COPY --from=builder /app/main .

CMD ["./main"]
