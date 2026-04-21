FROM golang:1.22-alpine AS build
WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=1 GOOS=linux go build -o server ./main.go

FROM alpine:3.20
RUN apk add --no-cache ca-certificates sqlite-libs
WORKDIR /app
COPY --from=build /app/server ./server
EXPOSE 8000
CMD ["./server"]
