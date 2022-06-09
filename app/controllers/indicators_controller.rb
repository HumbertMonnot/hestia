class IndicatorsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @search = Search.find(params[:search_id])
    @indicators = @search.indicators
    @texts = {'1' => "as l’âme proche de “Brigitte Bardot” et que tu as besoin d’être près des services liés à nos amis les bêtes.",
      '2' => "as besoin d’aller chercher “ta chocolatine” et ton entrecôte tous les jours à une distance acceptable !",
      '3' => "veux que tes enfants gagnent en autonomie en étant pas trop loin des écoles !",
      '4' => "adores avoir le choix entre 18 marques de coquillettes et pouvoir faire le plein en grandes surfaces !",
      '5' => "souhaites avoir le corps de Schwarzy  ou que ton mantra est proche de “un esprit sain, dans un cours sain.",
      '6' => "es hypocondriaque ou que tu as besoin d’un suivi médical régulier ! Assure-toi d’être proche des docteurs!",
      '7' => "n’as pas eu de chance dans la loterie génétique ou si tu as besoin d’une armée de spécialistes par trop loin !",
      '8' => "as décidé de surpeupler la planète et veux ce qu'il y a de mieux pour eux, assure-toi d’avoir tout à côté !",
      '9' => "un palais gourmet à sustenter et qu’il faut que tu restes très très éloigné de ta propre cuisine !",
      '10' => "as besoin d'entretenir tes boucles soyeuses et d'avoir toujours tes chemises doucle col repassées  ",
      '11' => "as le dressing de Kim Kardashian & qu’aller flâner dans les boutiques est une activité quotidienne !",
      '12' => "es adeptes de FranceCulture et que tu as besoin aller au théâtre ou voir une expo 3 fois par semaine."}

      @icons = { '1' => 'fa-paw',
        '2' => "fa-solid fa-cheese",
        '3' => 'fa-school',
        '4' => "fa-solid fa-cart-shopping",
        '5' => "fa-solid fa-futbol",
        '6' => "fa-solid fa-user-doctor",
        '7' => "fa-solid fa-user-nurse",
        '8' => "fa-solid fa-baby-carriage",
        '9' => "fa-solid fa-utensils",
        '10' => "fa-solid fa-store",
        '11' => "fa-solid fa-shop",
        '12' => "fa-solid fa-film"
      }
  end

  def update
    @indicator = Indicator.find(params[:id])
    @indicator.update(weight: (indicator_params[:weight].to_f / 10))
  end

  private

  def indicator_params
    params.require(:indicator).permit(:weight)
  end
end
