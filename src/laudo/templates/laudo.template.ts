import { Laudo } from '../laudo.entity';
import * as fs from 'fs';
import * as path from 'path';

const UPLOADS_DIR = 'C:/Users/Breno Piropo/api-gerenciamento/uploads';

export function gerarHtmlLaudo(laudo: Laudo): string {
  // Variável global para contar todas as fotos sequencialmente
  let contadorFotos = 0;

  // Função para carregar a logo em base64 - com fallback seguro
  const carregarLogo = () => {
    try {
      const logoPath = 'C:/Users/Breno Piropo/api-gerenciamento/uploads/DPT.jpg';
      
      // Verificação simples de existência - sem operações que podem causar 401
      if (fs.existsSync(logoPath)) {
        try {
          const ext = path.extname(logoPath).toLowerCase().slice(1);
          const base64 = fs.readFileSync(logoPath, { encoding: 'base64' });
          return `data:image/${ext};base64,${base64}`;
        } catch (error) {
          console.log('Logo encontrada mas não pôde ser lida - usando fallback');
          return '';
        }
      }
    } catch (error) {
      console.log('Erro ao acessar logo - usando fallback');
    }
    return '';
  };

  const logoBase64 = carregarLogo();

  const gerarFotosHtml = (idLaudo: number, tipoFotos: string, descricao: string) => {
    try {
      const fotosPath = path.join(UPLOADS_DIR, `Fotos do laudo ${idLaudo}`);
      
      if (!fs.existsSync(fotosPath)) {
        return '';
      }

      const fotos = fs.readdirSync(fotosPath)
        .filter(f => f.toLowerCase().includes(tipoFotos.toLowerCase()) && 
                (f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png')));
      
      if (fotos.length === 0) {
        return '';
      }

      return fotos.map((foto, index) => {
        try {
          const fotoPath = path.join(fotosPath, foto);
          const ext = path.extname(fotoPath).slice(1);
          const base64 = fs.readFileSync(fotoPath, { encoding: 'base64' });
          contadorFotos++;
          return `
            <div class="image-container">
              <div class="quadro-imagem">
                <img src="data:image/${ext};base64,${base64}" alt="Foto ${contadorFotos}" />
              </div>
              <div class="image-caption">Foto ${contadorFotos} - ${descricao}</div>
            </div>
          `;
        } catch (error) {
          contadorFotos++;
          return `
            <div class="image-container">
              <div class="quadro-imagem" style="display: flex; align-items: center; justify-content: center; color: #666;">
                Imagem não disponível
              </div>
              <div class="image-caption">Foto ${contadorFotos} - ${descricao}</div>
            </div>
          `;
        }
      }).join('');
    } catch (error) {
      return '';
    }
  };

  const formatarData = (dataString: string) => {
    if (!dataString) return new Date().toLocaleDateString('pt-BR');
    try {
      return new Date(dataString).toLocaleDateString('pt-BR');
    } catch {
      return new Date().toLocaleDateString('pt-BR');
    }
  };

  // Pega o primeiro veículo (único no array)
  const veiculo = laudo.veiculos?.[0];

  // Template seguro da logo
  const logoHtml = logoBase64 ? `
    <div class="logo-container">
      <img src="${logoBase64}" alt="Logo DPT" class="logo" />
    </div>
  ` : '';

  const logoNormalHtml = logoBase64 ? `
    <div class="logo-container-normal">
      <img src="${logoBase64}" alt="Logo DPT" class="logo-normal" />
    </div>
  ` : '';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laudo de Exame Pericial Nº ${laudo.id_laudo}</title>
    <style>
        @page {
            size: A4;
            margin: 15mm;
        }
        
        body {
            font-family: "Times New Roman", serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            font-size: 18px;
            color: #000;
        }
        
        .page {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            box-sizing: border-box;
            page-break-after: always;
            position: relative;
            display: flex;
            flex-direction: column;
        }
        
        /* Header da primeira página - MAIOR */
        .header-principal {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 3px solid #000;
            padding-bottom: 15px;
            flex-shrink: 0;
        }
        
        .logo-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 15px;
            height: 150px;
        }
        
        .logo {
            max-width: 180px;
            max-height: 150px;
            width: auto;
            height: auto;
        }
        
        .orgao-principal {
            font-weight: bold;
            font-size: 24px;
            margin-bottom: 8px;
            text-transform: uppercase;
        }
        
        .departamento-principal {
            font-weight: bold;
            font-size: 22px;
            margin-bottom: 5px;
        }
        
        .diretoria-principal, .coordenadoria-principal {
            font-size: 20px;
            margin-bottom: 4px;
        }
        
        /* Header da última página */
        .header-final {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            flex-shrink: 0;
        }
        
        .logo-container-normal {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
            height: 120px;
        }
        
        .logo-normal {
            max-width: 120px;
            max-height: 100px;
            width: auto;
            height: auto;
        }
        
        .orgao {
            font-weight: bold;
            font-size: 20px;
            margin-bottom: 5px;
        }
        
        .departamento {
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 3px;
        }
        
        .diretoria, .coordenadoria {
            font-size: 16px;
            margin-bottom: 3px;
        }
        
        .titulo-laudo {
            text-align: center;
            font-weight: bold;
            margin: 25px 0;
            font-size: 22px;
            text-transform: uppercase;
            flex-shrink: 0;
        }
        
        .info-requisicao {
            margin-bottom: 25px;
            border: 1px solid #000;
            padding: 15px;
            background-color: #f9f9f9;
            flex-shrink: 0;
            font-size: 18px;
        }
        
        .info-requisicao div {
            margin-bottom: 10px;
            font-size: 18px;
            display: flex;
            align-items: flex-start;
        }
        
        .secao {
            margin-bottom: 25px;
        }
        
        .secao-titulo {
            font-weight: bold;
            margin-bottom: 12px;
            text-decoration: underline;
            font-size: 20px;
            text-transform: uppercase;
        }
        
        .subsecao-titulo {
            font-weight: bold;
            margin: 15px 0 8px 0;
            font-size: 18px;
        }
        
        .assinatura {
            margin-top: auto;
            text-align: center;
            padding-top: 40px;
        }
        
        .linha-assinatura {
            border-top: 1px solid #000;
            width: 70%;
            margin: 0 auto;
            padding-top: 50px;
            font-weight: bold;
            font-size: 20px;
        }
        
        .conteudo-principal {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        
        .conteudo-imagens {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        }
        
        .image-container {
            text-align: center;
            margin: 15px 0;
            page-break-inside: avoid;
        }
        
        .image-caption {
            font-style: italic;
            margin-top: 5px;
            font-weight: bold;
            font-size: 18px;
            text-align: center;
            padding: 8px;
            background-color: #f0f0f0;
            border-radius: 4px;
        }
        
        .quadro-imagem {
            border: 2px solid #000;
            width: 420px;
            height: 420px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f5f5f5;
            overflow: hidden;
            margin: 0 auto;
            page-break-inside: avoid;
        }
        
        .quadro-imagem img {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            object-fit: contain;
        }
        
        .campo-destaque {
            font-weight: bold;
            display: inline-block;
            width: 260px;
            font-size: 18px;
            text-align: left;
            vertical-align: top;
        }
        
        .campo-valor {
            flex: 1;
            text-align: left;
            padding-left: 10px;
        }
        
        .conclusao {
            margin-top: 25px;
            text-align: justify;
            line-height: 1.8;
            font-size: 18px;
            padding: 15px;
            background-color: #f9f9f9;
            border-left: 4px solid #000;
        }
        
        .dados-veiculo {
            margin-left: 25px;
        }
        
        .dados-veiculo div {
            margin-bottom: 12px;
            font-size: 18px;
            display: flex;
            align-items: flex-start;
        }
        
        .grupo-imagens {
            page-break-inside: avoid;
            margin-bottom: 35px;
        }
        
        .texto-justificado {
            text-align: justify;
            line-height: 1.8;
        }
        
        .imagens-layout {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 25px;
            margin: 20px 0;
        }
        
        .imagem-item {
            width: 45%;
            margin-bottom: 30px;
            text-align: center;
            page-break-inside: avoid;
        }
        
        .pagina-conteudo {
            padding-top: 10mm;
        }
        
        .conteudo-completo {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
    </style>
</head>
<body>
    <!-- Página 1 - COM HEADER MAIOR E LOGO (SE DISPONÍVEL) -->
    <div class="page">
        <div class="header-principal">
            ${logoHtml}
            <div class="orgao-principal">SECRETARIA DA SEGURANÇA PÚBLICA</div>
            <div class="departamento-principal">Departamento de Polícia Técnica</div>
            <div class="diretoria-principal">Diretoria do Interior</div>
            <div class="coordenadoria-principal">Coordenadoria de Polícia Técnica de Ilhéus</div>
        </div>
        
        <div class="titulo-laudo">LAUDO DE EXAME PERICIAL Nº ${laudo.id_laudo}</div>
        
        <div class="info-requisicao">
            <div><span class="campo-destaque">ÓRGÃO REQUISITANTE:</span><span class="campo-valor">${laudo.orgao_requisitante}</span></div>
            <div><span class="campo-destaque">AUTORIDADE REQUISITANTE:</span><span class="campo-valor">${laudo.autoridade_requisitante}</span></div>
            <div><span class="campo-destaque">GUIA/OFICIO:</span><span class="campo-valor">${laudo.guia_oficio} Data Guia/Oficio: ${formatarData(new Date().toString())}</span></div>
            <div><span class="campo-destaque">OCORRÊNCIA POLICIAL:</span><span class="campo-valor">${laudo.ocorrencia_policial} Inquérito Policial: ${laudo.numero_inquerito}</span></div>
        </div>
        
        <div class="conteudo-principal">
            <div class="secao">
                <div class="secao-titulo">OBJETIVO DA PERÍCIA:</div>
                <div class="texto-justificado">${laudo.objetivo_pericia}</div>
            </div>
            
            <div class="secao">
                <div class="secao-titulo">PREÂMBULO:</div>
                <div class="texto-justificado">${laudo.preambulo}</div>
            </div>
            
            <div class="secao">
                <div class="secao-titulo">HISTÓRICO:</div>
                <div class="texto-justificado">${laudo.historico}</div>
            </div>
            
            <div class="secao">
                <div class="secao-titulo">EXAMES:</div>
                <div class="subsecao-titulo">Das características do Veículo examinado:</div>
                
                <div class="dados-veiculo">
                    <div><span class="campo-destaque">PLACA PORTADA:</span><span class="campo-valor">${veiculo?.num_placa || '-'}</span></div>
                    <div><span class="campo-destaque">MARCA /MODELO:</span><span class="campo-valor">${veiculo?.marca || '-'}</span></div>
                    <div><span class="campo-destaque">ESPÉCIE/TIPO:</span><span class="campo-valor">${veiculo?.categoria || '-'}</span></div>
                    <div><span class="campo-destaque">COR:</span><span class="campo-valor">${veiculo?.cor || '-'}</span></div>
                    <div><span class="campo-destaque">VIDROS:</span><span class="campo-valor">${veiculo?.id_vidros ? `${veiculo.id_vidros}` : '-'}</span></div>
                    <div><span class="campo-destaque">CHASSI:</span><span class="campo-valor">${veiculo?.num_chassi || '-'}</span></div>
                    <div><span class="campo-destaque">NUMERAÇÃO DO MOTOR:</span><span class="campo-valor">${veiculo?.id_motor || '-'}</span></div>
                    <div><span class="campo-destaque">OUTRAS NUMERAÇÕES:</span><span class="campo-valor">${veiculo?.outras_numeracoes || '-'}</span></div>
                </div>
            </div>
            
            <!-- Início das fotos na primeira página se couber -->
            <div class="grupo-imagens">
                <div class="secao">
                    <div class="secao-titulo">Fotos do Veículo</div>
                </div>
                <div class="imagens-layout">
                    ${gerarFotosHtml(laudo.id_laudo, 'foto_veiculo', 'Visão geral do veículo') || `
                    <div class="image-container">
                        <div class="quadro-imagem">Sem foto disponível</div>
                        <div class="image-caption">Foto ${++contadorFotos} - Visão geral do veículo</div>
                    </div>
                    `}
                </div>
            </div>
        </div>
    </div>
    
    <!-- Página 2 - Fotos das Placas e Vidros -->
    <div class="page">
        <div class="pagina-conteudo">
            <div class="conteudo-completo">
                <div class="grupo-imagens">
                    <div class="secao">
                        <div class="secao-titulo">Das Placas</div>
                        <div class="subsecao-titulo">DESCRIÇÃO DA PLACA:</div>
                        <div class="texto-justificado">${veiculo?.descricao_placa || 'Descrição das placas do veículo.'}</div>
                    </div>
                    
                    <div class="imagens-layout">
                        ${gerarFotosHtml(laudo.id_laudo, 'foto_placa', 'Placa do veículo') || `
                        <div class="image-container">
                            <div class="quadro-imagem">Sem foto disponível</div>
                            <div class="image-caption">Foto ${++contadorFotos} - Placa do veículo</div>
                        </div>
                        `}
                    </div>
                </div>
                
                <div class="grupo-imagens">
                    <div class="secao">
                        <div class="secao-titulo">Dos Vidros</div>
                        <div class="subsecao-titulo">DESCRIÇÃO DOS VIDROS:</div>
                        <div class="texto-justificado">${veiculo?.descricao_vidros || 'Descrição dos vidros do veículo.'}</div>
                    </div>
                    
                    <div class="imagens-layout">
                        ${gerarFotosHtml(laudo.id_laudo, 'foto_vidros', 'Vidros do veículo') || `
                        <div class="image-container">
                            <div class="quadro-imagem">Sem foto disponível</div>
                            <div class="image-caption">Foto ${++contadorFotos} - Vidros do veículo</div>
                        </div>
                        `}
                    </div>
                </div>
                
                <!-- Início do Chassi se couber na mesma página -->
                <div class="grupo-imagens">
                    <div class="secao">
                        <div class="secao-titulo">Do Chassi/VIN</div>
                        <div class="subsecao-titulo">DESCRIÇÃO DO CHASSI/VIN:</div>
                        <div class="texto-justificado">${veiculo?.descricao_chassi || 'Descrição do chassi/VIN do veículo.'}</div>
                    </div>
                    
                    <div class="imagens-layout">
                        ${gerarFotosHtml(laudo.id_laudo, 'foto_chassi', 'Chassi/VIN do veículo') || `
                        <div class="image-container">
                            <div class="quadro-imagem">Sem foto disponível</div>
                            <div class="image-caption">Foto ${++contadorFotos} - Chassi/VIN do veículo</div>
                        </div>
                        `}
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Página 3 - Motor e Dados Técnicos -->
    <div class="page">
        <div class="pagina-conteudo">
            <div class="conteudo-completo">
                <div class="grupo-imagens">
                    <div class="secao">
                        <div class="secao-titulo">Do Motor</div>
                        <div class="subsecao-titulo">DESCRIÇÃO DO MOTOR:</div>
                        <div class="texto-justificado">${veiculo?.descricao_motor || 'Descrição do motor do veículo.'}</div>
                    </div>
                    
                    <div class="imagens-layout">
                        ${gerarFotosHtml(laudo.id_laudo, 'foto_motor', 'Motor do veículo') || `
                        <div class="image-container">
                            <div class="quadro-imagem">Sem foto disponível</div>
                            <div class="image-caption">Foto ${++contadorFotos} - Motor do veículo</div>
                        </div>
                        `}
                    </div>
                </div>
                
                <div class="secao">
                    <div class="secao-titulo">Das Etiquetas</div>
                    <div class="texto-justificado">${veiculo?.etiquetas || 'Descrição das etiquetas do veículo.'}</div>
                </div>
                
                <div class="secao">
                    <div class="secao-titulo">Da Plaqueta do Ano de Fabricação</div>
                    <div class="texto-justificado">${veiculo?.plaquetas_ano_fabricacao || 'Plaqueta de ano de fabricação do veículo.'}</div>
                </div>
                
                <div class="secao">
                    <div class="secao-titulo">Dos Dados da Central Eletrônica</div>
                    <div class="texto-justificado">${veiculo?.dados_central_eletronica || 'Dados da central eletrônica do veículo.'}</div>
                </div>
                
                <div class="secao">
                    <div class="secao-titulo">Das Condições Técnicas do Veículo</div>
                    <div class="texto-justificado">${veiculo?.condicoes_tecnicas || 'Condições técnicas do veículo.'}</div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Página 4 - Conclusão e Assinatura COM HEADER -->
    <div class="page">
        <div class="header-final">
            ${logoNormalHtml}
            <div class="orgao">SECRETARIA DA SEGURANÇA PÚBLICA</div>
            <div class="departamento">Departamento de Polícia Técnica</div>
            <div class="diretoria">Diretoria do Interior</div>
            <div class="coordenadoria">Coordenadoria de Polícia Técnica de Ilhéus</div>
        </div>
        
        <div class="conteudo-principal">
            <div class="secao">
                <div class="secao-titulo">Conclusão</div>
                <div class="texto-justificado">${veiculo?.conclusao || 'Conclusão do exame pericial.'}</div>
            </div>
            
            <div class="assinatura">
                <div class="linha-assinatura">Assinatura do Responsável</div>
            </div>
        </div>
    </div>
</body>
</html>
  `;
}