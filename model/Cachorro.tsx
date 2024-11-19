export class Cachorro {
    public id : string;
    public nome : string;
    public sexo : string;
    public raca : string;
    public datanasc : string;
    public urlfoto : string;

    constructor(obj?: Partial<Cachorro>){
        if (obj){
            this.id = obj.id
            this.nome = obj.nome
            this.sexo = obj.sexo
            this.raca = obj.raca
            this.datanasc = obj.datanasc
            this.urlfoto = obj.urlfoto
        }
    }

    toString(){
        const objeto=`{
            "id"       : "${this.id}",
            "nome"     : "${this.nome}",
            "sexo"     : "${this.sexo}",
            "raca"     : "${this.raca}",
            "datanasc" : "${this.datanasc}",
            "urlfoto"  : "${this.urlfoto}"
        }`
        return objeto
    }

    toFirestore(){
        const cachorro={
            id      : this.id,
            nome    : this.nome,
            sexo    : this.sexo,
            raca    : this.raca,
            datanasc: this.datanasc,
            urlfoto : this.urlfoto
        }
        return cachorro
    }


}