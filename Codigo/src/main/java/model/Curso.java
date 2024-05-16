package model;
public class Curso {
    private int id;
    private String nome;
    private int idArea;

    public Curso(int id, String nome, int idArea) {
        this.id = id;
        this.nome = nome;
        this.idArea = idArea;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public int getIdArea() {
        return idArea;
    }

    public void setIdArea(int idArea) {
        this.idArea = idArea;
    }

    @Override
    public String toString() {
        return "Curso{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", idArea=" + idArea +
                '}';
    }
}
