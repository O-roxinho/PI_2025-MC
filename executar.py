import os
import subprocess
import sys
import platform

project_folder = os.getcwd()
print("Diretório do projeto:", project_folder)

env_name = "ambiente_virtual"
env_path = os.path.join(project_folder, env_name)
config_folder = os.path.join(project_folder, "config")

os.makedirs(config_folder, exist_ok=True)

if os.path.exists(env_path):
    print("Ambiente virtual já existe. Ativando...")
else:
    print("Criando o ambiente virtual no diretório especificado...")
    subprocess.run([sys.executable, "-m", "venv", env_path])

print("Ativando o ambiente virtual...")
if platform.system() == "Windows":
    activate_script = os.path.join(env_path, "Scripts", "Activate.bat")
else:
    activate_script = os.path.join(env_path, "bin", "activate")

print("Instalando dependências do requirements2.txt...")
try:
    subprocess.run(f"{activate_script} && pip install -r requirements.txt", shell=True, cwd=project_folder)
except:
    print('opaaaaaaaaaaaaa não deu')

manage_script = os.path.join(config_folder, "manage.py")
if os.path.isfile(manage_script):
    print("Iniciando o servidor Django...")
    subprocess.run([os.path.join(env_path, "Scripts", "python.exe"), "manage.py", "runserver"], cwd=config_folder)
else:
    print("Erro: O arquivo manage.py não foi encontrado no diretório 'config'. faça o diretorio direito macaco!!!")
    print('erro mais provavel voce colocou em outra pasta o projeto, a raiz do projeto tem que ser -----PROJETO_PI_LOJA----')
    print('pode ser outro nome claro mais deide que essa pasta seja a raiz se existir outra não vai achar o caminho!!!!')
