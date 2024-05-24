package model;

import java.util.Collection;

public class Usuario {
	public int id;
	private String cpf;
	private int matricula;
	private int tipo;
	private int idCurso;
	private int periodo;
	private String nome;
	private String senha;
    private String email; // Adicione o campo de e-mail

	
	public Usuario() {
		this.cpf = "";
		this.matricula = 0;
		this.senha = "";
		this.nome = "";
		this.tipo = 0;
		this.idCurso = 0;
		this.periodo = 0;
		this.email = "";
	}
	
	public Usuario(String cpf, String nome, String senha, int matricula, int tipo, int idCurso, int periodo, String email) {
	    this.cpf = cpf;
	    this.nome = nome;
	    this.senha = senha;
	    this.matricula = matricula;
	    this.tipo = tipo;
	    this.idCurso = idCurso;
	    this.periodo = periodo;
	    this.email = email; // Inicialize o campo de e-mail no construtor
	}
	
	public Usuario(int id, String cpf, String nome, String senha, int matricula, int tipo, int idCurso, int periodo, String email) {
	    this.id = id;
		this.cpf = cpf;
	    this.nome = nome;
	    this.senha = senha;
	    this.matricula = matricula;
	    this.tipo = tipo;
	    this.idCurso = idCurso;
	    this.periodo = periodo;
	    this.email = email; // Inicialize o campo de e-mail no construtor
	}
    

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

	public int getMatricula() {
		return matricula;
	}

	public void setMatricula(int matricula) {
		this.matricula = matricula;
	}
	
	public int getTipo() {
		return tipo;
	}
	
	public void setTipo(int tipo) {
		this.tipo = tipo;
	}
	
	public int getIdCurso () {
		return idCurso;
	}
	
	public void setIdCurso(int idCurso) {
		this.idCurso = idCurso;
	}
	
	public int getPeriodo () {
		return periodo;
	}
	
	public void setPeriodo (int periodo) {
		this.periodo = periodo;
	}

	@Override
	public String toString() {
		return "Usuario [id=" + id + ", cpf=" + cpf + ", nome=" + nome + ", senha=" + senha + ", email=" + email + ", matricula=" + matricula + "]";
	}

	public int getId() {
		// TODO Auto-generated method stub
		return this.id;
	}
	
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
