package model;

public class Publicacao {
    private int id;
    private String tipo;
    private String conteudo;
    private int idAluno;
    private int like;
    private String coments;

    public Publicacao(int id, String tipo, String conteudo, int idAluno, int like, String coments) {
        this.id = id;
        this.tipo = tipo;
        this.conteudo = conteudo;
        this.idAluno = idAluno;
        this.like = like;
        this.coments = coments;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public int getIdAluno() {
        return idAluno;
    }

    public void setIdAluno(int idAluno) {
        this.idAluno = idAluno;
    }

    public int getLike() {
        return like;
    }

    public void setLike(int like) {
        this.like = like;
    }

    public String getComents() {
        return coments;
    }

    public void setComents(String coments) {
        this.coments = coments;
    }

    @Override
    public String toString() {
        return "Publicacao [id=" + id + ", tipo=" + tipo + ", conteudo=" + conteudo + ", idAluno=" + idAluno
                + ", like=" + like + ", coments=" + coments + "]";
    }
}
