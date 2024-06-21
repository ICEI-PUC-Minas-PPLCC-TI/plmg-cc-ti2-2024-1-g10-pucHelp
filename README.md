# PUCHELP

O projeto se resume em uma mini rede social, onde somente alunos da PUC Minas terão acesso, e nessa rede eles poderão fazer publicações e reagir às mesmas, interagindo com outros alunos e tirando dúvidas acerca de aspectos relacionados à Universidade.

## Alunos integrantes da equipe

* João Victor Martins dos Anjos
* Enzo Monteiro Alves
* Victor Eduardo Cruz Arrighi
* Pedro Henrique Siman
* Jancker Nicolas Yauri Lazo de la Vega

## Professores responsáveis

* Amália Soares Vieira de Vasconcelos
* Sandro Jerônimo de Almeida

## Instruções de utilização

1- Para executar a aplicação, são necessárias a instalação de dependências Maven, e é recomendado o uso da plataforma Eclipse, que facilita a integração. Devem ser instaladas todas as dependências Maven contidas e declaradas no arquivo pom.xml presente em Codigo/src/main/java.
2- O segundo passo é rodar o script sql presente em Codigo/src/main/resources/script_bd. Este código irá criar as tabelas necessárias no banco de dados para que o sistema funcione corretamente, e, além disso, irá popular algumas tabelas com informações iniciais para uso do sistema.
4- O passo quatro consiste em configurar corretamente as keys relativas ao banco de dados Postgresql. Para isso deve se acessar cada um dos arquivos da pasta dao presentes em Codigo/src/main/java/dao. Cada um deles possui um método conectar, onde são setadas as keys e informações do banco de dados, como no exemplo abaixo:

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
 
3- Após isso, o próximo passo é rodar o servidor Spark, que é o que faz nosso back-end funcionar. Para tal dentro do Eclipse, deve-se procurar o arquivo Main.java, no diretório Codigo/src/main/java/app, e executar a aplicação.

4- Uma vez executado o servidor Spark, agora é necessário configurar e executar o servidor node.js, necessário para o funcionamento do sistema inteligente de extração de informações de imagens.
  1- Caso não possua, instalar o node.js em sua versão mais recente em sua máquina.
  2 - Abrir no terminal a pasta Codigo/main/resources/AI e rodar o comando npm intall. Que irá instalar todas as dependências necessárias para o funcionamento do servidor node.js.
  3 - Após instaladas as dependências, agora basta rodar o servidor node.js, para tal, é necessário, no Eclipse, ir até o arquivo script.js, clicar com o botao direito, ir em Run AS e node Aplication.
  4 - Uma vez rodando o servidor node.js está em pleno funcionamento e pronto para ser usado.
  
5 - Agora o último passo é rodar o front-end. Para isso é muito simples:
  1 - Instalar, se necessário, o Visual Studio Code, em sua máquina.
  2 - No VSCODE, instalar a extensão live server
  3 - Abrir a pasta Codigo/src/main/resources/front-end como um projeto no VSCODE.
  4 - Ir até o arquivo login.html, clicar com o botão direito no código e clicar em Open With Live Server
  5 - Pronto, o front-end está pronto para ser utilizado.

6 - Agora para usar o sistema basta usar as informações inciais de login/ou realizar um cadastro
matricula: 1002
senha: aluno123

7 - Pronto, agora é usar e aproveitar do que a plataforma PUCHELP tem a oferecer!
