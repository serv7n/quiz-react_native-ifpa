import axios from "axios";

class Api {
    constructor() {
        this.client = axios.create({
            baseURL: "http://localhost:8000/api", // ✅ ajustado conforme pedido
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
            const response = await this.client.post("/aluno/login", { user, senha });
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

    async register({ user, email, senha, pontuacao = 0, turma_id = null }) {
        try {
            const response = await this.client.post("/aluno", {
                user,
                email,
                senha,
                pontuacao,
                turma_id,
            });
            return response.data;
        } catch (error) {
            console.error("Erro no cadastro:", error.response?.data || error.message);
            return error.response?.data || { status_code: 500, messege: "Erro no servidor" };
        }
    }

    async updateTurma(id, turma_id) {
        try {
            const response = await this.client.put(`/aluno/${id}/turma`, { turma_id });
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar turma do aluno:", error.response?.data || error.message);
            return error.response?.data || { status_code: 500, messege: "Erro ao atualizar turma" };
        }
    }

    async questoesUsuario(id) {
        try {
            const response = await this.client.get(`/questoes/usuario/${id}`);
            const data = response.data;

            if (data?.status_code !== 200 || !data?.data?.questoes) {
                return { status_code: 404, message: "Nenhuma questão encontrada" };
            }

            // 🔄 Converter formato das questões da API para o formato local
            const questoesConvertidas = {};
            data.data.questoes.forEach((q, index) => {
                const corretaNum = parseInt(q.altCorreta.replace("alt", ""));
                questoesConvertidas[index + 1] = {
                    id: q.id,
                    title: q.title,
                    alternativas: {
                        1: q.alt1,
                        2: q.alt2,
                        3: q.alt3,
                        4: q.alt4,
                    },
                    correta: corretaNum,
                    timing: q.timing || 10,
                    turma_id: q.turma_id ?? null,
                };
            });

            // 🕒 Capturar o campo "comecar" ou "comecou" (dependendo do backend)
            const comecar = data.data.comecar ?? data.data.comecou ?? null;

            return {
                status_code: 200,
                message: "success",
                comecar,
                questoes: questoesConvertidas,
            };
        } catch (error) {
            console.error("Erro ao buscar questões do usuário:", error.response?.data || error.message);
            return (
                error.response?.data || {
                    status_code: 500,
                    message: "Erro ao carregar questões",
                }
            );
        }
    }

}

export default new Api();
