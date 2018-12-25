import { InMemoryDbService } from 'angular-in-memory-web-api';

// categorias Web-Api
export class InMemoryDatabase implements InMemoryDbService{
    createDb() {
        const categories = [
          { id: 1, name: 'Moradia', descricao: 'Pagamentos de Contas da Casa '},
          { id: 2, name: 'Saúde', descricao: 'Plano de Sáude e Remédios'},
          { id: 3, name: 'Lazer', descricao: 'Cinema, parques, praia, etc'},
          { id: 4, name: 'Salário', descricao: 'Recimento de Salário'},
          { id: 1, name: 'lazer', descricao: 'Trabalhos como freelancer'},

        ];
        return { categories }
    }
}

