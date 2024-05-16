package model;

public class TipoUsuario {
    private int id;
    private String nome;

    public TipoUsuario(int id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    // Getters
    public int getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }
    
    @Override
    public String toString() {
        return "TipoUsuario{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                '}';
    }
}
