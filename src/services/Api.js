import axios from "axios";

class Api {
    constructor() {
        this.client = axios.create({
            baseURL: "https://app-quiz-laravel-2.squareweb.app/api", // ✅ ajustado conforme pedido
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
     
            const response = await this.client.get(`/questoes/usuario/${id}`);
        const data = response.data; // Aqui você já tem o objeto completo
      
        return data;
           
    }
    async atualizarPontuacao(id, valor) {
        try {
            // Envia no formato que o Laravel espera
            const dados = {
                pontuacao: valor,
            };

            const response = await this.client.put(`/aluno/${id}/pontuacao`, dados);

            // Retorno padronizado
            return {
                status_code: response.data?.status_code ?? 200,
                messege: response.data?.messege ?? "Pontuação atualizada com sucesso",
                data: response.data?.data ?? null,
            };
        } catch (error) {
            console.error(
                "Erro ao atualizar pontuação do aluno:",
                error.response?.data || error.message
            );

            return {
                status_code: error.response?.status ?? 500,
                messege:
                    error.response?.data?.messege ??
                    "Erro ao atualizar pontuação do aluno",
                data: null,
            };
        }
    }

    async getRankingPorAluno(alunoId) {
        try {
            const response = await this.client.post("/alunos/ranking", {
                aluno_id: alunoId,
            });

            // Garante retorno padronizado
            return {
                status_code: response.data?.status_code ?? 200,
                messege: response.data?.messege ?? "success",
                data: response.data?.data ?? null,
            };
        } catch (error) {
            console.error(
                "Erro ao buscar ranking do aluno:",
                error.response?.data || error.message
            );

            return {
                status_code: error.response?.status ?? 500,
                messege:
                    error.response?.data?.messege ?? "Erro ao buscar ranking do aluno",
                data: null,
            };
        }
    }


}

export default new Api();
