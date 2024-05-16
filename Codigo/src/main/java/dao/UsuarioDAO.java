package dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import model.Usuario;

public class UsuarioDAO {
	private List<Usuario> usuarios;
	private Connection conexao;
	private int maxId = 0;
	
	public UsuarioDAO() {
		conexao = null;
		this.usuarios = new ArrayList<Usuario>();
//		this.getFromDB();
	}
	
	public int getMaxId() {
		return this.maxId;
	}
	
	public void incrementMaxId() {
		this.maxId++;
	}
	
	public boolean conectar() {
		String driverName = "org.postgresql.Driver";                
		String serverName = "localhost";
		String mydatabase = "PUCHELP";
		int porta = 5432;
		String url = "jdbc:postgresql://" + serverName + ":" + porta +"/" + mydatabase;
		String username = "postgres";
		String password = "root";
		boolean status = false;

		try {
			Class.forName(driverName);
			conexao = DriverManager.getConnection(url, username, password);
			status = (conexao == null);
			System.out.println("Conexão efetuada com o postgres!");
		} catch (ClassNotFoundException e) { 
			System.err.println("Conexão NÃO efetuada com o postgres -- Driver não encontrado -- " + e.getMessage());
		} catch (SQLException e) {
			System.err.println("Conexão NÃO efetuada com o postgres -- " + e.getMessage());
		}

		return status;
	}
	
	public boolean close() {
		boolean status = false;
		
		try {
			conexao.close();
			status = true;
		} catch (SQLException e) {
			System.err.println(e.getMessage());
		}
		return status;
	}
	
	public Usuario get(int matricula) {
		for (Usuario usuario: usuarios) {
			if (matricula == usuario.getMatricula()) {
				return usuario;
			}
		}
		return null;
	}
	
	public List<Usuario> getAll() {
		return usuarios;
	}
	
	private List<Usuario> getFromDB() {
		usuarios.clear();
		Usuario usuario = null;
		try {
			Usuario usuarios[] = this.getUsuarios();
			System.out.println(usuarios);
			for (int i = 0; i < usuarios.length; i++) {
				usuario = (Usuario) usuarios[i];
				this.usuarios.add(usuario);
			}
		} catch (Exception e) {
			System.out.println("ERRO ao gravar usuario no disco!");
			e.printStackTrace();
		}
		return usuarios;
	}
	
	private Connection getConexao() {
	    if (conexao == null) {
	        conectar();
	    }
	    return conexao;
	}
	
	public boolean inserirUsuario(Usuario usuario) {
		boolean status = false;
		try {
			System.out.println("111");
			Statement st = getConexao().createStatement();
			System.out.println("000");
			st.executeUpdate("INSERT INTO usuario (cpf, matricula, tipo, idcurso, periodo, nome, senha) "
					       + "VALUES ("+ usuario.getCpf() + ", '" + usuario.getMatricula() + "', '"  
					       + usuario.getTipo() + "', '"  + usuario.getIdCurso() + "', '" +  usuario.getPeriodo() +
					       "', '" + usuario.getNome() + "', '" + usuario.getSenha() + "');");
			st.close();
			status = true;
			this.incrementMaxId();
		} catch (SQLException u) {  
			throw new RuntimeException(u);
		}
		return status;
	}
	
	public boolean atualizarUsuario(Usuario usuario) {
		boolean status = false;
		try {  
			Statement st = conexao.createStatement();
			String sql = "UPDATE usuario SET nome = '" + usuario.getNome() + "', senha = '"  
				       + usuario.getSenha() + "', matricula = '" + usuario.getMatricula() + "'"
					   + " WHERE matricula =" + usuario.getMatricula();
			st.executeUpdate(sql);
			st.close();
			status = true;
		} catch (SQLException u) {  
			throw new RuntimeException(u);
		}
		return status;
	}
	
	public boolean excluirUsuario(int matricula) {
		boolean status = false;
		try {  
			Statement st = conexao.createStatement();
			st.executeUpdate("DELETE FROM usuario WHERE matricula = " + matricula);
			st.close();
			status = true;
		} catch (SQLException u) {
			throw new RuntimeException(u);
		}
		return status;
	}
	
	
	public Usuario[] getUsuarios() {
		Usuario[] usuarios = null;
		
		try {
			Statement st = conexao.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);
			ResultSet rs = st.executeQuery("SELECT * FROM usuario");		
	         if(rs.next()){
	             rs.last();
	             usuarios = new Usuario[rs.getRow()];
	             rs.beforeFirst();

	             for(int i = 0; rs.next(); i++) {
	                usuarios[i] = new Usuario(rs.getString("cpf"), rs.getString("nome"), rs.getString("senha"),
	                		rs.getInt("matricula"), rs.getInt("tipo"), rs.getInt("idCurso"), rs.getInt("periodo"));
	             }
	          }
	          st.close();
		} catch (Exception e) {
			System.err.println(e.getMessage());
		}
		return usuarios;
	}

	
	public Usuario[] getUsuariosAlunos() {
		Usuario[] usuarios = null;
		
		try {
			Statement st = conexao.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);
			ResultSet rs = st.executeQuery("SELECT * FROM usuario WHERE usuario.tipo = 1");		
	         if(rs.next()){
	             rs.last();
	             usuarios = new Usuario[rs.getRow()];
	             rs.beforeFirst();

	             for(int i = 0; rs.next(); i++) {
	            	 usuarios[i] = new Usuario(rs.getString("cpf"), rs.getString("nome"), rs.getString("senha"),
		                		rs.getInt("matricula"), rs.getInt("tipo"), rs.getInt("idCurso"), rs.getInt("periodo"));
	             }
	          }
	          st.close();
		} catch (Exception e) {
			System.err.println(e.getMessage());
		}
		return usuarios;
	}
}