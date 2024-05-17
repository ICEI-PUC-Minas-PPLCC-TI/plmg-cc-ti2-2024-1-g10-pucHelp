package dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import model.Publicacao;

public class PublicacaoDAO {
    private List<Publicacao> publicacoes;
    private Connection conexao;
    private int maxId = 0;

    public PublicacaoDAO() {
        conexao = null;
        this.publicacoes = new ArrayList<Publicacao>();
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
            System.out.println("Conex�o efetuada com o postgres!");
        } catch (ClassNotFoundException e) { 
            System.err.println("Conex�o N�O efetuada com o postgres -- Driver n�o encontrado -- " + e.getMessage());
        } catch (SQLException e) {
            System.err.println("Conex�o N�O efetuada com o postgres -- " + e.getMessage());
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

    public Publicacao getPublicacaoById(int id) {
        try {
            String query = "SELECT * FROM publicacoes WHERE id = ?";
            PreparedStatement statement = conexao.prepareStatement(query);
            statement.setInt(1, id);
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                String tipo = resultSet.getString("tipo");
                String conteudo = resultSet.getString("conteudo");
                int idAluno = resultSet.getInt("idAluno");
                int like = resultSet.getInt("likes");
                String coments = resultSet.getString("coments");

                return new Publicacao(id, tipo, conteudo, idAluno, like, coments);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }


    public List<Publicacao> getAll() {
        return publicacoes;
    }

    private List<Publicacao> getFromDB() {
        publicacoes.clear();
        Publicacao publicacao = null;
        try {
            Publicacao publicacoes[] = this.getPublicacoes();
            for (int i = 0; i < publicacoes.length; i++) {
                publicacao = (Publicacao) publicacoes[i];
                this.publicacoes.add(publicacao);
            }
        } catch (Exception e) {
            System.out.println("ERRO ao gravar publicacao no disco!");
            e.printStackTrace();
        }
        return publicacoes;
    }
    
    
    public List<Publicacao> getTodasPublicacoes() {
        List<Publicacao> publicacoes = new ArrayList<>();
        try {
            Statement st = conexao.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            ResultSet rs = st.executeQuery("SELECT * FROM publicacoes");

            while (rs.next()) {
                Publicacao publicacao = new Publicacao(
                        rs.getInt("id"),
                        rs.getString("tipo"),
                        rs.getString("conteudo"),
                        rs.getInt("idAluno"),
                        rs.getInt("likes"),
                        rs.getString("coments")
                );
                publicacoes.add(publicacao);
            }
            st.close();
        } catch (SQLException e) {
            System.err.println("Erro ao recuperar todas as publicações: " + e.getMessage());
        }
        return publicacoes;
    }
    
    private Connection getConexao() {
        if (conexao == null) {
            conectar();
        }
        return conexao;
    }

    public boolean inserirPublicacao(Publicacao publicacao) {
        boolean status = false;
        try {
            Statement st = getConexao().createStatement();
            st.executeUpdate("INSERT INTO publicacoes (tipo, conteudo, idAluno, likes, coments) "
                           + "VALUES ('" + publicacao.getTipo() + "', '" + publicacao.getConteudo() + "', "  
                           + publicacao.getIdAluno() + ", " + publicacao.getLike() + ", '" + publicacao.getComents() + "');");
            st.close();
            status = true;
            this.incrementMaxId();
        } catch (SQLException u) {  
            throw new RuntimeException(u);
        }
        return status;
    }

    public boolean atualizarPublicacao(Publicacao publicacao) {
        boolean status = false;
        try {  
            Statement st = conexao.createStatement();
            String sql = "UPDATE publicacoes SET tipo = '" + publicacao.getTipo() + "', conteudo = '"  
                       + publicacao.getConteudo() + "', idAluno = " + publicacao.getIdAluno() + ", likes = " 
                       + publicacao.getLike() + ", coments = '" + publicacao.getComents() + "' WHERE id = " + publicacao.getId();
            st.executeUpdate(sql);
            st.close();
            status = true;
        } catch (SQLException u) {  
            throw new RuntimeException(u);
        }
        return status;
    }

    public boolean excluirPublicacao(int id) {
        boolean status = false;
        try {  
            Statement st = conexao.createStatement();
            st.executeUpdate("DELETE FROM publicacoes WHERE id = " + id);
            st.close();
            status = true;
        } catch (SQLException u) {
            throw new RuntimeException(u);
        }
        return status;
    }

    public Publicacao[] getPublicacoes() {
        Publicacao[] publicacoes = null;
        
        try {
            Statement st = conexao.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);
            ResultSet rs = st.executeQuery("SELECT * FROM publicacoes");        
            if(rs.next()){
                rs.last();
                publicacoes = new Publicacao[rs.getRow()];
                rs.beforeFirst();

                for(int i = 0; rs.next(); i++) {
                    publicacoes[i] = new Publicacao(rs.getInt("id"), rs.getString("tipo"), rs.getString("conteudo"),
                        rs.getInt("idAluno"), rs.getInt("likes"), rs.getString("coments"));
                }
            }
            st.close();
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
        return publicacoes;
    }

    public Publicacao[] getPublicacoesByTipo(String tipo) {
        Publicacao[] publicacoes = null;
        
        try {
            Statement st = conexao.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);
            ResultSet rs = st.executeQuery("SELECT * FROM publicacoes WHERE tipo = '" + tipo + "'");        
            if(rs.next()){
                rs.last();
                publicacoes = new Publicacao[rs.getRow()];
                rs.beforeFirst();

                for(int i = 0; rs.next(); i++) {
                    publicacoes[i] = new Publicacao(rs.getInt("id"), rs.getString("tipo"), rs.getString("conteudo"),
                        rs.getInt("idAluno"), rs.getInt("likes"), rs.getString("coments"));
                }
            }
            st.close();
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
        return publicacoes;
    }
}
