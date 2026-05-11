const http = require("http");

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });

    res.end(`
        <h1>Web Quest Server Running ✅</h1>

        <h2>Java Test Code:</h2>

        <pre>
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Render!");
    }
}
        </pre>
    `);
});

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
