$.getJSON('participantes.json', (data) => {
	data.forEach((aluno) => {
		const marcador = createMarcador(aluno);
		const participante = createParticipante(aluno);
		marcador.click(() => {
			if (marcador.attr('active') == 'false') {
				participante.css('display', 'flex');
				marcador.attr('active', 'true');
			} else {
				participante.css('display', 'none');
				marcador.attr('active', 'false');
			}
		});
	});
});

const createMarcador = (aluno) => {
	var { nome, nomeCompleto, posto, curso, opcao, foto } = aluno;
	var marcador = $('#padrao_marcador').clone().removeAttr('id');
	$('.m_posto', marcador).html(posto);
	$('.m_nome_guerra', marcador).html(nome);
	$('.m_nome_completo', marcador).html(nomeCompleto);
	$('.m_img', marcador).attr('src', 'img/' + foto);
	$('.m_img', marcador).attr('alt', 'Foto de ' + nome);
	marcador.attr('curso', curso);
	marcador.attr('opcao', opcao);
	marcador.attr('active', 'false');
	$('#marcacao').append(marcador);
	return marcador;
};

const createParticipante = (aluno) => {
	var { nome, nomeCompleto, curso, opcao, foto } = aluno;
	var participante = $('#padrao_participante').clone().removeAttr('id');
	$('.p_title', participante).html(nome);
	$('.p_img', participante).attr('src', 'img/' + foto);
	$('.p_img', participante).attr('alt', 'Foto de ' + nome);
	participante.attr('curso', curso);
	participante.attr('opcao', opcao);
	participante.attr('ambos', `${curso} ${opcao}`);
	participante.css('display', 'none');
	$('#participantes').append(participante);
	return participante;
};

$('#nav')
	.children()
	.each((k, e) => {
		console.log(k);
		$(e).click(() => {
			$('section')
				.children()
				.css('display', 'none')
				.each((i, e) => {
					if (i == k) $(e).css('display', 'block');
				});
		});
	});

$('#filtro').change(() => {
	const filtro = $('#filtro').val();
	$('#participantes')
		.children()
		.each((k, e) => {
			if (filtro == 'todos') {
				$(e).removeClass('filtered');
				return;
			}
			if ($(e).attr('ambos') !== filtro) {
				$(e).addClass('filtered');
			} else {
				$(e).removeClass('filtered');
			}
		});
});

const exportExcel = () => {
	let rows = [];
	$('#marcacao')
		.children()
		.each((k, e) => {
			let participante = 'Yes';
			if ($(e).attr('active') == 'false') {
				participante = 'No';
			}
			const title = $(e).find('.m_nome_completo').html();
			const curso = $(e).attr('curso');
			const opcao = $(e).attr('opcao');
			rows.push([title, curso, opcao, participante]);
		});
	rows.sort((a, b) => {
		if (a[3] == 'Yes' && b[3] == 'No') return -1;
		if (a[3] == 'No' && b[3] == 'Yes') return 1;
		if (a[1] == b[1]) {
			if (a[2] == b[2]) {
				return a[0].localeCompare(b[0]);
			}
			if (a[2] == 'Ativa' && b[2] == 'Reserva') return -1;
			if (a[2] == 'Reserva' && b[2] == 'Ativa') return 1;
		}
		return a[1].localeCompare(b[1]);
	});
	console.log(rows);
	const header = ['Nome', 'Posto', 'Opcao', 'Participante'];
	let csvContent = 'data:text/csv;charset=utf-8,' + header.join(',') + '\r\n';

	csvContent += rows.map((e) => e.join(',')).join('\r\n');
	var encodedUri = encodeURI(csvContent);
	window.open(encodedUri);
};

$('.export').click(exportExcel);
