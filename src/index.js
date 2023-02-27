function server(port) {
    require('./app')(port)
}

function main() {
    server(4000)
}

main()
