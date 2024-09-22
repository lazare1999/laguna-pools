package com.lagunapools.lagunapools.app.clients.service;

import com.lagunapools.lagunapools.app.clients.models.AllClientsRequestDTO;
import com.lagunapools.lagunapools.app.clients.models.AllClientsResponseDTO;
import com.lagunapools.lagunapools.app.clients.models.ClientDTO;
import com.lagunapools.lagunapools.app.clients.repository.ClientEntity;
import com.lagunapools.lagunapools.app.clients.repository.ClientsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import static com.lagunapools.lagunapools.utils.ResponseUtils.badRequestResponse;
import static com.lagunapools.lagunapools.utils.ResponseUtils.okResponse;

@Service
public class ClientsServiceImpl implements ClientsService {
    private final ClientsRepository clientsRepository;

    public ClientsServiceImpl(ClientsRepository clientsRepository) {
        this.clientsRepository = clientsRepository;
    }

    @Override
    public ResponseEntity<?> addClient(ClientDTO client) {
        try {
            clientsRepository.save(new ClientEntity(client));
        } catch (Exception ex) {
            ex.printStackTrace();
            return badRequestResponse(ex.getStackTrace());
        }
        return okResponse(true);
    }

    @Override
    public AllClientsResponseDTO getAllClients(AllClientsRequestDTO request) {
//        if (Objects.isNull(request)
//                || request.getPageKey() == null
//                || request.getPageSize() == null) {
//            return new AllClientsResponseDTO();
//        }
//
//        return clientsRepository.findAll();
        return null;
    }
}
