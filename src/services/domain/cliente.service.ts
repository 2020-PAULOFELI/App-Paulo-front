import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PictureSourceType } from "@ionic-native/camera";
import { Form } from "ionic-angular";
import { Observable } from "rxjs/Rx";
import { ClienteDTO } from "../../app/models/cliente.dto";
import { API_CONFIG } from "../../config/api.config";
import { ImageUtilService } from "../image-util.service";
import { StorageService } from "../storage.service";



@Injectable()
export class ClienteService{
    
    constructor(
        public http: HttpClient, 
        public storage: StorageService,
        public imageUtilService: ImageUtilService){
    }

    findByEmail(email: string) {   
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/email?value=${email}`); 
    }
    findById(id: string) {   
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/${id}`); 
    }

    getImageFromBucket(id : string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`
        return this.http.get(url, {responseType : 'blob'});
    }

    insert(obj: ClienteDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes`,
            obj,{
                observe: 'response',
                responseType: 'text'
            }
        );
    }
    uploadPicture(picture) { //conversão de base 64 para blob
        let pictureBlob = this.imageUtilService.dataUriToBlob(picture);
        let formData : FormData = new FormData();
        formData.set('file', pictureBlob, 'file.png');
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes/picture`,
            formData,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

}