export class Raca {
    public id : string;
    public nome : string;

    constructor(obj?: Partial<Raca>){
        if (obj){
            this.id = obj.id
            this.nome = obj.nome
        }
    }

    toString(){
        const objeto=`{
            "id"       : "${this.id}",
            "nome"     : "${this.nome}",
        }`
        return objeto
    }

    toFirestore(){
        const raca={
            id      : this.id,
            nome    : this.nome,
        }
        return raca
    }


}