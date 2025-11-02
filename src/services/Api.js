import axios from "axios";

class Api {
    constructor() {
        this.client = axios.create({
            // Troque para seu IP real ou para 10.0.2.2 se estiver usando emulador Android Studio
            baseURL: "http://192.168.1.4:8000/api",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
    }

    async api() {
        try {
            const response = await this.client.get("/status");
            return response.data;
        } catch (error) {
            console.error("Erro ao conectar com API:", error.message);
            throw error;
        }
    }

    async login(user, senha) {
        try {
            const response = await this.client.post("/aluno/login", {
                user,
                senha,
            });
            return response.data;
        } catch (error) {
            console.error("Erro no login:", error.response?.data || error.message);
            throw error;
        }
    }

    async refresh(id) {
        try {
            const response = await this.client.post("/aluno/refresh", { id });
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar dados do aluno:", error.message);
            throw error;
        }
    }

    async turmas() {
        try {
            const response = await this.client.get("/turma");
            return response.data.data;
        } catch (error) {
            console.error("Erro ao buscar turmas:", error.message);
            throw error;
        }
    }
}

export default new Api();
