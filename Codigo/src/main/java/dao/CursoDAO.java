package dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import model.Curso;

public class CursoDAO {
    private Connection conexao;

    public CursoDAO() {
        this.conexao = null;
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

    public List<Curso> listarCursos() {
        List<Curso> cursos = new ArrayList<>();
        String sql = "SELECT id, nome, idarea FROM curso";

        try (PreparedStatement stmt = conexao.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                int id = rs.getInt("id");
                String nome = rs.getString("nome");
                int idArea = rs.getInt("idarea");

                Curso curso = new Curso(id, nome, idArea);
                cursos.add(curso);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return cursos;
    }

    public Curso getCursoById(int idCurso) {
        Curso curso = null;
        String sql = "SELECT id, nome, idarea FROM curso WHERE id = ?";

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setInt(1, idCurso);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    int id = rs.getInt("id");
                    String nome = rs.getString("nome");
                    int idArea = rs.getInt("idarea");

                    curso = new Curso(id, nome, idArea);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return curso;
    }

    public boolean atualizarCurso(Curso cursoAtualizado) {
        String sql = "UPDATE curso SET nome = ?, idarea = ? WHERE id = ?";

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, cursoAtualizado.getNome());
            stmt.setInt(2, cursoAtualizado.getIdArea());
            stmt.setInt(3, cursoAtualizado.getId());

            int linhasAfetadas = stmt.executeUpdate();
            return linhasAfetadas > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean removerCurso(int idCurso) {
        String sql = "DELETE FROM curso WHERE id = ?";

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setInt(1, idCurso);
            int linhasAfetadas = stmt.executeUpdate();
            return linhasAfetadas > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public int inserirCurso(Curso novoCurso) {
        String sql = "INSERT INTO curso (nome, idarea) VALUES (?, ?) RETURNING id";

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, novoCurso.getNome());
            stmt.setInt(2, novoCurso.getIdArea());

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt("id");
            } else {
                return -1; // Se não houver ID retornado, significa que a inserção falhou
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return -1; // Retorna -1 em caso de erro
        }
    }


}
