package dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import model.TipoUsuario;
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
		String mydatabase = "puchelp";
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
			System.out.println("ERRO ao gravar produto no disco!");
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
	        Connection conexao = getConexao();
	        String sql = "INSERT INTO usuario (cpf, matricula, tipo, idcurso, periodo, nome, senha, email) " +
	                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
	        PreparedStatement st = conexao.prepareStatement(sql);
	        st.setString(1, usuario.getCpf());
	        st.setInt(2, usuario.getMatricula());
	        st.setInt(3, usuario.getTipo());
	        st.setInt(4, usuario.getIdCurso());
	        st.setInt(5, usuario.getPeriodo());
	        st.setString(6, usuario.getNome());
	        st.setString(7, usuario.getSenha());
	        st.setString(8, usuario.getEmail());
	        int rowsAffected = st.executeUpdate();
	        st.close();
	        if (rowsAffected > 0) {
	            status = true;
	            incrementMaxId();
	        }
	    } catch (SQLException e) {
	        System.out.println(e);
	        throw new RuntimeException(e);
	    }
	    return status;
	}

	
	public boolean atualizarUsuario(Usuario usuario) {
	    boolean status = false;
	    try {  
	        String sql = "UPDATE usuario SET nome = ?, senha = ?, matricula = ?, email = ? WHERE matricula = ?";
	        PreparedStatement st = conexao.prepareStatement(sql);
	        st.setString(1, usuario.getNome());
	        st.setString(2, usuario.getSenha());
	        st.setInt(3, usuario.getMatricula());
	        st.setString(4, usuario.getEmail()); // Este parâmetro é usado para o WHERE
	        st.setInt(5, usuario.getMatricula());
	        int rowsUpdated = st.executeUpdate();
	        st.close();

	        if (rowsUpdated > 0) {
	            status = true;
	        }
	    } catch (SQLException e) {  
	        throw new RuntimeException(e);
	    }
	    return status;
	}

	public boolean excluirUsuario(int id) {
		boolean status = false;
		try {  
			Statement st = conexao.createStatement();
			st.executeUpdate("DELETE FROM usuario WHERE id = " + id);
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
	                		rs.getInt("matricula"), rs.getInt("tipo"), rs.getInt("idCurso"), rs.getInt("periodo"), rs.getString("email"));
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
		                		rs.getInt("matricula"), rs.getInt("tipo"), rs.getInt("idCurso"), rs.getInt("periodo"), rs.getString("email"));
	             }
	          }
	          st.close();
		} catch (Exception e) {
			System.err.println(e.getMessage());
		}
		return usuarios;
	}
	
	
	public Usuario getByMatricula(int matricula) {
	    Usuario usuario = null;
	    try {
	        Statement st = conexao.createStatement();
	        String sql = "SELECT * FROM usuario WHERE matricula = " + matricula;
	        ResultSet rs = st.executeQuery(sql);
	        if (rs.next()) {
	            // Extrair os dados do usuário do ResultSet
	        	int id = rs.getInt("id");
	            String cpf = rs.getString("cpf");
	            String nome = rs.getString("nome");
	            String senha = rs.getString("senha");
	            int tipo = rs.getInt("tipo");
	            int idCurso = rs.getInt("idcurso");
	            int periodo = rs.getInt("periodo");
	            String email = rs.getString("email");
	            // Criar o objeto Usuario com os dados obtidos
	            usuario = new Usuario(id, cpf, nome, senha, matricula, tipo, idCurso, periodo, email);
	        }
	        st.close();
	    } catch (SQLException u) {
	        throw new RuntimeException(u);
	    }
	    return usuario;
	}
	
	public Usuario getById(int id) {
	    Usuario usuario = null;
	    try {
	        Statement st = conexao.createStatement();
	        String sql = "SELECT * FROM usuario INNER JOIN curso ON curso.id = usuario.idcurso"
	        		+ " WHERE usuario.id = " + id;
	        ResultSet rs = st.executeQuery(sql);
	        if (rs.next()) {
	            // Extrair os dados do usuário do ResultSet
	            String cpf = rs.getString("cpf");
	            String nome = rs.getString("nome");
	            String senha = rs.getString("senha");
	            int matricula = rs.getInt("matricula");
	            int tipo = rs.getInt("tipo");
	            int idCurso = rs.getInt("idcurso");
	            int periodo = rs.getInt("periodo");
	            String email = rs.getString("email");
	            System.out.println(id);
	            // Criar o objeto Usuario com os dados obtidos
	            usuario = new Usuario(id, cpf, nome, senha, matricula, tipo, idCurso, periodo, email);
	        }
	        st.close();
	    } catch (SQLException u) {
	        throw new RuntimeException(u);
	    }
	    return usuario;
	}


	
	public List<TipoUsuario> getTiposUsuarios() {
	    List<TipoUsuario> tiposUsuarios = new ArrayList<>();
	    try {  
	        Statement st = conexao.createStatement();
	        String sql = "SELECT id, nome FROM tipo_usuario";
	        ResultSet rs = st.executeQuery(sql);
	        while (rs.next()) {
	            int id = rs.getInt("id");
	            String nome = rs.getString("nome");
	            TipoUsuario tipoUsuario = new TipoUsuario(id, nome);
	            tiposUsuarios.add(tipoUsuario);
	        }
	        st.close();
	    } catch (SQLException u) {  
	        throw new RuntimeException(u);
	    }
	    System.out.println(tiposUsuarios);
	    return tiposUsuarios;
	}
}